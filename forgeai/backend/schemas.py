from pydantic import BaseModel
from typing import List, Optional

class TelemetryInput(BaseModel):
    temperature: float
    vibration: float
    current: float
    rpm: float

class PredictionOutput(BaseModel):
    health_score: float
    status: str  # "Healthy", "Warning", "Critical"
    rul_hours: int
    primary_factor: str
    explanation: str
    color_code: str  # Hex code for 3D twin color

class TelemetryPoint(BaseModel):
    timestamp: str
    vibration: float
    temperature: float
    current: float
    rpm: float

class TelemetryHistoryResponse(BaseModel):
    history: List[TelemetryPoint]

class BatchPredictionOutput(BaseModel):
    history: List[TelemetryPoint]
    latest_prediction: PredictionOutput
    batch_count: int
