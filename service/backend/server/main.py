from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import sys

# тестовые данные
import testdata.LoadData as LoadData
from testdata.Visualization import Visualization
from testdata.LR_prediction import LR_prediction
# from testdata.LR_prediction_rem import LR_prediction2
from testdata.SARIMA import SARIMA
from testdata.IntradayAnalytics import IntradayAnalytics


app = FastAPI(title="WaterEmergencyPredict API", version="1.0")

# Pydantic модель для POST body
class ProcessRequest(BaseModel):
    action: str

# Один endpoint, который поддерживает и GET, и POST
@app.api_route("/fetch_chart_data", methods=["GET", "POST"])
async def process(
    action: Optional[str] = Query(None, description="Action for GET"),
    body: Optional[ProcessRequest] = None
):
    # Выбираем источник данных: POST body приоритетнее
    if body is not None:
        action_val = body.action
    else:
        if not action:
            raise HTTPException(status_code=400, detail="Missing 'action' parameter")
        action_val = action

    if action_val == "Visualization":
        result = json.dumps(Visualization(LoadData.dataframes_list[0]), ensure_ascii=False)

    if action_val == "LR_prediction":
        result = json.dumps(LR_prediction(LoadData.dataframes_list[0]), ensure_ascii=False)

    if action_val == "SARIMA":
        result = 'SARIMA'
        # result = json.dumps(SARIMA(LoadData.dataframes_list[0]), ensure_ascii=False)

    if action_val == "IntradayAnalytics":
        result = json.dumps(IntradayAnalytics(LoadData.dataframes_list[0]), ensure_ascii=False)

    return {"status": 'ok', "data": result}
