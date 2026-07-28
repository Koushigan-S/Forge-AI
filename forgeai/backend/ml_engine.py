import random
import math
from datetime import datetime, timedelta
from typing import List, Dict, Any
import pandas as pd

from schemas import TelemetryInput, PredictionOutput, TelemetryPoint, BatchPredictionOutput

class MLEngine:
    def __init__(self):
        pass

    def predict(self, input_data: TelemetryInput) -> PredictionOutput:
        temp = max(20.0, min(120.0, input_data.temperature))
        vib = max(0.0, min(15.0, input_data.vibration))
        curr = max(5.0, min(50.0, input_data.current))
        rpm = max(500.0, min(5000.0, input_data.rpm))

        # Normalized risk ratios relative to operating bounds
        temp_risk = (temp - 20.0) / 100.0
        vib_risk = vib / 15.0
        curr_risk = (curr - 5.0) / 45.0
        
        # Weighted risk calculation
        risk_score = (temp_risk * 0.35) + (vib_risk * 0.40) + (curr_risk * 0.25)
        
        # RPM strain factor above nominal 3000 RPM
        if rpm > 3000:
            risk_score += ((rpm - 3000.0) / 2000.0) * 0.10

        health_score = round(max(0.0, min(100.0, (1.0 - risk_score) * 100.0)), 1)

        # Status & RUL logic based on spec thresholds
        if health_score > 80.0:
            status = "Healthy"
            color_code = "#06b6d4"  # Electric Cyan
            rul_hours = int(120 + (health_score - 80.0) * 4.0)
        elif health_score >= 45.0:
            status = "Warning"
            color_code = "#f59e0b"  # Amber Gold
            rul_hours = int(24 + (health_score - 45.0) * 1.37)
        else:
            status = "Critical"
            color_code = "#ef4444"  # Crimson Red
            rul_hours = int(max(1, 2 + (health_score / 45.0) * 16.0))

        # Determine Primary Factor
        ratios = [
            ("Mechanical Vibration", vib_risk * 1.3),
            ("Bearing Overheating", temp_risk * 1.1),
            ("Electrical Overcurrent", curr_risk * 0.9),
            ("High Centrifugal RPM", ((rpm - 500) / 4500) * 0.8)
        ]
        ratios.sort(key=lambda x: x[1], reverse=True)

        if health_score > 80.0:
            primary_factor = "Normal Operations"
        else:
            primary_factor = ratios[0][0]

        # Generate Explainable AI Text Diagnostic
        explanation = self._generate_explanation(
            temp=temp,
            vib=vib,
            curr=curr,
            rpm=rpm,
            health_score=health_score,
            status=status,
            primary_factor=primary_factor,
            rul_hours=rul_hours
        )

        return PredictionOutput(
            health_score=health_score,
            status=status,
            rul_hours=rul_hours,
            primary_factor=primary_factor,
            explanation=explanation,
            color_code=color_code
        )

    def _generate_explanation(
        self, temp: float, vib: float, curr: float, rpm: float,
        health_score: float, status: str, primary_factor: str, rul_hours: int
    ) -> str:
        if status == "Healthy":
            return (
                f"System operating nominally at {health_score}% health. "
                f"Temperature ({temp:.1f}°C) and Vibration ({vib:.2f} mm/s) are within standard operational baselines for this load profile. "
                f"Projected bearing degradation is minimal over the next {rul_hours} operating hours."
            )
        elif status == "Warning":
            return (
                f"Caution advised: System health has degraded to {health_score}%. "
                f"Elevated stress detected in {primary_factor}. "
                f"Vibration levels ({vib:.2f} mm/s) and Temperature ({temp:.1f}°C) exceed baseline nominal thresholds. "
                f"Estimated Remaining Useful Life (RUL) is ~{rul_hours} hours. "
                f"Recommend scheduling preventive maintenance and lubrication during the next service window."
            )
        else: # Critical
            return (
                f"CRITICAL FAILURE RISK ALERT ({health_score}% Health Score). "
                f"Severe anomaly in {primary_factor}. "
                f"Temperature ({temp:.1f}°C), Vibration ({vib:.2f} mm/s), and Current ({curr:.1f}A) indicate imminent thermal/mechanical breakdown. "
                f"Estimated RUL is critical at {rul_hours} hours. "
                f"Immediate emergency shutdown and component inspection strongly required to prevent failure."
            )

    def generate_sample_telemetry(self, points: int = 24) -> List[TelemetryPoint]:
        history = []
        now = datetime.now()
        
        for i in range(points, 0, -1):
            t_stamp = (now - timedelta(minutes=i * 5)).strftime("%H:%M")
            sin_val = math.sin(i / 3.0)
            
            vib = max(0.5, round(2.1 + sin_val * 0.8 + random.uniform(-0.3, 0.4), 2))
            temp = max(30.0, round(45.0 + sin_val * 6.0 + random.uniform(-2.0, 3.0), 1))
            curr = max(8.0, round(12.0 + sin_val * 2.5 + random.uniform(-1.0, 1.5), 1))
            rpm = max(1200.0, round(1800.0 + sin_val * 150.0 + random.uniform(-50.0, 50.0), 0))
            
            history.append(TelemetryPoint(
                timestamp=t_stamp,
                vibration=vib,
                temperature=temp,
                current=curr,
                rpm=rpm
            ))
            
        return history

    def process_csv(self, df: pd.DataFrame) -> BatchPredictionOutput:
        df.columns = [str(col).strip().lower() for col in df.columns]
        
        required = ['temperature', 'vibration', 'current', 'rpm']
        for req in required:
            if req not in df.columns:
                if req == 'temperature': df[req] = 45.0
                elif req == 'vibration': df[req] = 2.1
                elif req == 'current': df[req] = 12.0
                elif req == 'rpm': df[req] = 1800.0

        history = []
        now = datetime.now()
        count = len(df)
        
        for idx, row in df.iterrows():
            t_stamp = (now - timedelta(minutes=(count - idx) * 5)).strftime("%H:%M")
            history.append(TelemetryPoint(
                timestamp=str(row.get('timestamp', t_stamp)),
                vibration=float(row['vibration']),
                temperature=float(row['temperature']),
                current=float(row['current']),
                rpm=float(row['rpm'])
            ))

        last_row = df.iloc[-1]
        latest_input = TelemetryInput(
            temperature=float(last_row['temperature']),
            vibration=float(last_row['vibration']),
            current=float(last_row['current']),
            rpm=float(last_row['rpm'])
        )
        latest_pred = self.predict(latest_input)

        return BatchPredictionOutput(
            history=history,
            latest_prediction=latest_pred,
            batch_count=count
        )

ml_engine = MLEngine()
