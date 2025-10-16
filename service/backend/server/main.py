from fastapi import FastAPI, Query, HTTPException, File, UploadFile, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

import time
import pendulum
import pandas as pd
import re
import json
import os, sys
import shutil

# db
from sqlalchemy import create_engine, Column, Integer, JSON, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# тестовые данные
from testdata.LoadData import LoadData
from testdata.Visualization import Visualization
from testdata.LR_prediction import LR_prediction
from testdata.SARIMA import SARIMA
from testdata.IntradayAnalytics import IntradayAnalytics



app = FastAPI(title="WaterEmergencyPredict API", version="1.0")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic модель для POST body
class ProcessRequest(BaseModel):
    action: str

# ENDPOINT: получение данных аналитики в json
@app.api_route("/fetch_chart_data", methods=["GET", "POST"])
@app.api_route("/api/fetch_chart_data", methods=["GET", "POST"])
async def process(
    action: Optional[str] = Query(None, description="Action for GET"),
    xlsx_file_name: Optional[str] = Query(None, description="xlsx_file_name for GET"),
    body: Optional[ProcessRequest] = None
):
    if body is not None:
        action_val = body.action
        xlsx_file_name_val = body.xlsx_file_name
    else:
        if not action:
            raise HTTPException(status_code=400, detail="Missing 'action' parameter")
        action_val = action

    if action_val == "Visualization":
        result = json.dumps(Visualization(LoadData()), ensure_ascii=False)
    elif action_val == "LR_prediction":
        result = json.dumps(LR_prediction(LoadData()), ensure_ascii=False)
    elif action_val == "IntradayAnalytics":
        result = json.dumps(IntradayAnalytics(LoadData()), ensure_ascii=False)
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    return {"status": "ok", "data": result}

# ENDPOINT: загрузка пользовательского файла для аналитики
@app.post("/upload/")
@app.post("/api/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        UPLOAD_FOLDER = "uploads"
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return JSONResponse(status_code=200, content={"message": f"File {file.filename} uploaded successfully"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error uploading file: {str(e)}"})


Base = declarative_base()

# Конфигурация базы данных
MYSQL_HOST = os.getenv("MYSQL_HOST", "mysql")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "example")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "mydb")

DATABASE_URL = f"mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DATABASE}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Модель для таблицы json_data
class Data(Base):
    __tablename__ = "json_data"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    data = Column(JSON)
    upload_date = Column(String(19))  ### (ДОБАВЛЕНО) для хранения даты и времени загрузки
    file_name = Column(String(255))   ### (ДОБАВЛЕНО) для хранения имени файла



### (ДОБАВЛЕНО)
# Модель для таблицы process_status
class ProcessStatus(Base):
    __tablename__ = "process_status"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    status = Column(String(50), default="processed")
    error_message = Column(String(500), nullable=True)  # Для хранения сообщения об ошибке


# Создание таблиц
Base.metadata.create_all(bind=engine)

### (ДОБАВЛЕНО)
# Функция валидации структуры файла .xlsx
def validate_xlsx_file(file_path: str) -> None:
    try:
        # Чтение файла с помощью pandas
        df = pd.read_excel(file_path)

        # Ожидаемые столбцы ( ТОЧНОЕ СООТВЕТСТВИЕ ЗАГОЛОВКОВ )
        # expected_columns = [
        #     'Дата', 'Время суток, ч', 'Подача, м3', 'Обратка, м3',
        #     'Потребление за период, м3', 'Т1 гвс, оС', 'Т2 гвс, оС'
        # ]
        #
        # # Проверка наличия всех столбцов
        # if not all(col in df.columns for col in expected_columns):
        #     missing_cols = [col for col in expected_columns if col not in df.columns]
        #     raise HTTPException(
        #         status_code=400,
        #         detail=f"Файл не соответствует формату. Отсутствуют столбцы: {', '.join(missing_cols)}"
        #     )


        # Ожидаемые ключевые слова для столбцов ( ВХОЖДЕНИЕ СЛОВ В НАЗВАНИЕ ЗАГОЛОВКОВ )
        expected_keywords = [
            'Дата', 'Время суток', 'Подача', 'Обратка',
            'Потребление за период, м3', 'Т1 гвс', 'Т2 гвс'
        ]
        # Проверка наличия ключевых слов в названиях столбцов
        missing_keywords = []
        for keyword in expected_keywords:
            if not any(keyword.lower() in col.lower() for col in df.columns):
                missing_keywords.append(keyword)

        if missing_keywords:
            raise HTTPException(
                status_code=400,
                detail=f"Файл не соответствует формату. Отсутствуют столбцы с ключевыми словами: {', '.join(missing_keywords)}"
            )


        # Проверка типов данных и формата
        for index, row in df.iterrows():
            # Проверка формата даты (DD.MM.YYYY)
            try:
                pd.to_datetime(row['Дата'], format='%d.%m.%Y')
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Неверный формат даты в строке {index + 2}: {row['Дата']} (ожидалось DD.MM.YYYY)"
                )

            # Проверка формата времени (0-1, 1-2, ..., 23-24)
            if not isinstance(row['Время суток, ч'], str) or not re.match(r'^\d{1,2}-\d{1,2}$', row['Время суток, ч']):
                raise HTTPException(
                    status_code=400,
                    detail=f"Неверный формат времени в строке {index + 2}: {row['Время суток, ч']} (ожидалось формат 'H-H+1')"
                )

            # Проверка числовых столбцов
            numeric_columns = ['Подача, м3', 'Обратка, м3', 'Потребление за период, м3', 'Т1 гвс, оС', 'Т2 гвс, оС']
            for col in numeric_columns:
                if not pd.api.types.is_numeric_dtype(df[col]) or pd.isna(row[col]):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Некорректное значение в столбце '{col}' в строке {index + 2}: {row[col]} (ожидалось число)"
                    )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"Ошибка при чтении файла: {str(e)}")

# Функция обработки данных
def process_data(data_id: int, new_filename: str):

    db = SessionLocal()
    try:
        # Пример ошибки для проверки
        #raise ValueError( "Тестовая ошибка обработки файла")
        # status.data = "sdvwsevf"
        # Имитация обработки (sleep)
        # time.sleep(10)
        # Формирование общего словаря

        #print(new_filename)
        dataset = LoadData(new_filename)
        result_analit = json.dumps({
            "Visualization": Visualization(dataset),
            "LR_prediction": LR_prediction(dataset),
            "IntradayAnalytics": IntradayAnalytics(dataset)
        }, ensure_ascii=False)
        print(result_analit)
        # добавляем данные в базу
        db_data = db.query(Data).filter(Data.id == data_id).first()
        if db_data:
            db_data.data = result_analit;
            db.commit()

        # Если обработка успешна, обновляем статус
        status = db.query(ProcessStatus).filter(ProcessStatus.id == data_id).first()
        if status:
            status.status = "completed"
            status.error_message = None
            db.commit()
    except Exception as e:
        # Обработка любых ошибок
        status = db.query(ProcessStatus).filter(ProcessStatus.id == data_id).first()
        if status:
            status.status = "error"
            status.error_message = f"Файл не может быть обработан: {str(e)}"
            db.commit()
        # Экранируем ошибку для логирования
        #error_traceback = traceback.format_exc()
        #print(f"Ошибка обработки для ID {data_id}:\n{error_traceback}")
    finally:
        db.close()

@app.post("/save-data/")
@app.post("/api/save-data/")
async def save_data(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    db = SessionLocal()
    try:
        # Проверка расширения файла
        if not file.filename.lower().endswith('.xlsx'):
            raise HTTPException(status_code=400, detail="Загружаемый файл должен иметь формат .xlsx")

        # Время в часовом поясе Москвы
        moscow_time = pendulum.now("Europe/Moscow")
        date_str = moscow_time.strftime("%d_%m_%Y")
        timestamp_str = moscow_time.strftime("%Y-%m-%d %H:%M:%S")

        # Формирование имени файла с датой
        original_filename = file.filename
        file_base, file_ext = os.path.splitext(original_filename)
        new_filename = f"{file_base}__{timestamp_str}{file_ext}"

        # Сохранение файла
        UPLOAD_FOLDER = "uploads"
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file_path = os.path.join(UPLOAD_FOLDER, new_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Валидация файла
        validate_xlsx_file(file_path)


        # Создание записи в json_data
        #json_data = {"filename": new_filename}  # Временные данные, можно заменить реальными

        # db_data = Data(data=json_data, upload_date=timestamp_str, file_name=new_filename)
        db_data = Data(upload_date=timestamp_str, file_name=new_filename)

        db.add(db_data)
        db.commit()
        db.refresh(db_data)

        # Создание записи в process_status
        db_status = ProcessStatus(id=db_data.id, status="processed")
        db.add(db_status)
        db.commit()

        # Запуск фоновой задачи
        background_tasks.add_task(process_data, db_data.id, new_filename)

        return {"id": db_data.id, "status": "processed", "filename": new_filename}
    except Exception as e:
        raise e
    finally:
        db.close()

@app.get("/get-data/{data_id}")
@app.get("/api/get-data/{data_id}")
async def get_data(data_id: int):
    db = SessionLocal()
    try:
        status = db.query(ProcessStatus).filter(ProcessStatus.id == data_id).first()
        if not status:
            return {"error": "Процесс обработки данных не найден"}

        if status.status == "processed":
            return {"id": data_id, "status": "processed"}
        elif status.status == "error":
            return {"id": data_id, "status": "error", "error_message": status.error_message}
        elif status.status == "completed":
            data = db.query(Data).filter(Data.id == data_id).first()
            if data:
                return {"id": data.id, "data": data.data, "status": status.status, "upload_date": data.upload_date, "file_name": data.file_name}
            return {"error": "Данные не найдены в таблице json_data"}
        return {"error": "Неизвестный статус"}
    finally:
        db.close()

@app.get("/get-status/{data_id}")
@app.get("/api/get-status/{data_id}")
async def get_status(data_id: int):
    db = SessionLocal()
    try:
        data = db.query(ProcessStatus).filter(ProcessStatus.id == data_id).first()
        if data:
            return {"id": data.id, "status": data.status, "error_message": data.error_message}
        return {"error": "Процесс обработки данных не найден"}
    finally:
        db.close()

# Отладочный метод
@app.get("/health")
@app.get("/api/health")
async def health_check():
    print("Health check endpoint called")
    return {"status": "OK"}
