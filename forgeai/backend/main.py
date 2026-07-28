from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

from schemas import TelemetryInput, PredictionOutput, TelemetryHistoryResponse, BatchPredictionOutput
from ml_engine import ml_engine

app = FastAPI(
    title="ForgeAI Predictive Maintenance Engine",
    description="FastAPI Backend for ForgeAI Industrial Digital Twin & ML Telemetry Analytics",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "ForgeAI Telemetry & Digital Twin Engine",
        "version": "1.0.0"
    }

@app.post("/api/predict", response_model=PredictionOutput)
def predict_telemetry(data: TelemetryInput):
    """
    Computes ML Health Score, Status Classification, RUL, Primary Failure Risk, and XAI Diagnostics.
    """
    try:
        prediction = ml_engine.predict(data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/telemetry", response_model=TelemetryHistoryResponse)
def get_sample_telemetry():
    """
    Returns initial 24-point time-series telemetry data stream for live analytics charts.
    """
    try:
        history = ml_engine.generate_sample_telemetry(points=24)
        return TelemetryHistoryResponse(history=history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-csv", response_model=BatchPredictionOutput)
async def upload_csv_telemetry(file: UploadFile = File(...)):
    """
    Parses uploaded telemetry CSV file, executes batch ML inference, and returns telemetry history + latest diagnosis.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV file.")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        if df.empty:
            raise HTTPException(status_code=400, detail="Uploaded CSV file is empty.")
            
        result = ml_engine.process_csv(df)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
