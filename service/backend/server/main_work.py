from fastapi import FastAPI, Query, HTTPException, File, UploadFile, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os, sys
import shutil
# db
from sqlalchemy import create_engine, Column, Integer, JSON, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import time

# тестовые данные
from testdata.LoadData import LoadData
from testdata.Visualization import Visualization
from testdata.LR_prediction import LR_prediction
# from testdata.LR_prediction_rem import LR_prediction2
from testdata.SARIMA import SARIMA
from testdata.IntradayAnalytics import IntradayAnalytics

# LoadData(); sys.exit()
# LoadData('Посуточная ведомость ОДПУ ГВС.xlsx'); sys.exit()

#result = json.dumps(Visualization(LoadData()), ensure_ascii=False); print(result); sys.exit()

# тест
#SARIMA(LoadData()); sys.exit()


app = FastAPI(title="WaterEmergencyPredict API", version="1.0")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
#    allow_origins=[ "http://localhost:3081", ],  # Имя сервиса фронтенда в Docker Compose
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)


# Pydantic модель для POST body
class ProcessRequest(BaseModel):
    action: str

# ENDPOINT: получение в нанных аналитики в json ( Visualization / LR_prediction / SARIMA / IntradayAnalytics )
# Один endpoint, который поддерживает и GET, и POST
@app.api_route("/fetch_chart_data", methods=["GET", "POST"])
@app.api_route("/api/fetch_chart_data", methods=["GET", "POST"])
async def process(
    action: Optional[str] = Query(None, description="Action for GET"),
    xlsx_file_name: Optional[str] = Query(None, description="xlsx_file_name for GET"),
    body: Optional[ProcessRequest] = None
):
    # Выбираем источник данных: POST body приоритетнее
    if body is not None:
        action_val = body.action
        xlsx_file_name_val = body.xlsx_file_name

    else:
        if not action:
            raise HTTPException(status_code=400, detail="Missing 'action' parameter")
        action_val = action

    if action_val == "Visualization":
        result = json.dumps(Visualization(LoadData()), ensure_ascii=False)


    if action_val == "LR_prediction":
        result = json.dumps(LR_prediction(LoadData()), ensure_ascii=False)

    #if action_val == "SARIMA":
    #    result = 'SARIMA'
        # result = json.dumps(SARIMA(LoadData()), ensure_ascii=False)

    if action_val == "IntradayAnalytics":
        result = json.dumps(IntradayAnalytics(LoadData()), ensure_ascii=False)

    return {"status": 'ok', "data": result}


# ENDPOINT: загрузка пользовательского файла для аналитики
# TODO: проверить являеться ли xlsx
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Папка для сохранения файлов / сохранение
        UPLOAD_FOLDER = "uploads"; os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        # Путь для сохранения файла
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        # Сохраняем файл
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return JSONResponse( status_code=200, content={"message": f"File {file.filename} uploaded successfully"} )
    except Exception as e:
        return JSONResponse( status_code=500, content={"message": f"Error uploading file: {str(e)}"} )



###--------------------------------------------------------

Base = declarative_base()

# Конфигурация базы данных
MYSQL_HOST = os.getenv("MYSQL_HOST", "mysql")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "example")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "mydb")

DATABASE_URL = f"mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DATABASE}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

###--------------------------------------------------------




##############################################################

# Модель для таблицы
class Data(Base):
    __tablename__ = "json_data"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    data = Column(JSON)
    #status = Column(String(50), default="processed")

# Модель для таблицы process_status
class ProcessStatus(Base):
    __tablename__ = "process_status"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    status = Column(String(50), default="processed")

# Создание таблицы
Base.metadata.create_all(bind=engine)

# Фоновая задача для имитации длительной обработки
def process_data(data_id: int):
    # Имитация длительной обработки
    time.sleep(15)  # Задержка 15 секунд
    db = SessionLocal()
    try:
        # Обновляем статус в таблице process_status
        ### (ДОБАВЛЕНО)
        status = db.query(ProcessStatus).filter(ProcessStatus.id == data_id).first()
        if status:
            status.status = "completed"
            db.commit()
    finally:
        db.close()



@app.post("/save-data/")
async def save_data(json_data: dict, background_tasks: BackgroundTasks):
    db = SessionLocal()
    try:
        # Создание записи в json_data
        db_data = Data(data=json_data)
        db.add(db_data)
        db.commit()
        db.refresh(db_data)

        # Создание записи в process_status
        ### (ДОБАВЛЕНО)
        db_status = ProcessStatus(id=db_data.id, status="processed")
        db.add(db_status)
        db.commit()

        # Запуск фоновой задачи для обработки
        background_tasks.add_task(process_data, db_data.id)

        # Немедленный ответ с ID и статусом
        return {"id": db_data.id, "status": "processed"}
    finally:
        db.close()



@app.get("/get-data/{data_id}")
async def get_data(data_id: int):
    db = SessionLocal()
    try:
        # Проверяем статус в таблице process_status
        ### (ДОБАВЛЕНО)
        status = db.query(ProcessStatus).filter(ProcessStatus.id == data_id).first()
        if not status:
            return {"error": "Процесс обработки данных не найден"}

        if status.status == "processed":
            return {"id": data_id, "status": "processed"}

        if status.status == "completed":
            # Забираем результат из таблицы json_data
            data = db.query(Data).filter(Data.id == data_id).first()
            if data:
                return {"id": data.id, "data": data.data, "status": status.status}
            return {"error": "Данные не найдены в таблице json_data"}

        return {"error": "Неизвестный статус"}
    finally:
        db.close()

@app.get("/get-status/{data_id}")
async def get_status(data_id: int):
    db = SessionLocal()
    try:
        # Проверяем статус в таблице process_status
        ### (ДОБАВЛЕНО)
        data = db.query(ProcessStatus).filter(ProcessStatus.id == data_id).first()
        if data:
            return {"id": data.id, "status": data.status}
        return {"error": "Процесс обработки данных не найден"}
    finally:
        db.close()

##############################################################



# Отладочный метод
# http://localhost/8080/health
@app.get("/health")
async def health_check():
    print("Health check endpoint called")
    return {"status": "OK777"}
