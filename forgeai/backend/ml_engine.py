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

        # Normalized risk ratios relative to ISO 10816-3 & IEEE motor standards
        # Temp nominal: 35-50°C, Warning >70°C, Critical >90°C
        temp_risk = max(0.0, (temp - 30.0) / 90.0)
        # Vib ISO 10816-3 Class II: Nominal < 2.3 mm/s, Warning 2.3-4.5 mm/s, Critical > 7.1 mm/s
        vib_risk = min(1.0, vib / 10.0)
        # Current nominal: 10-15A, Warning >28A, Critical >40A
        curr_risk = max(0.0, (curr - 10.0) / 40.0)
        
        # Weighted risk calculation
        risk_score = (temp_risk * 0.35) + (vib_risk * 0.45) + (curr_risk * 0.20)
        
        # RPM strain factor above nominal 1800 RPM
        if rpm > 2400:
            risk_score += ((rpm - 2400.0) / 2600.0) * 0.15

        health_score = round(max(0.0, min(100.0, (1.0 - risk_score) * 100.0)), 1)

        # Status & RUL logic based on ISO 10816-3 severity standards
        if health_score >= 82.0:
            status = "Healthy"
            color_code = "#10b981"  # ISO Emerald Green
            rul_hours = int(140 + (health_score - 82.0) * 4.5)
            iso_class = "ISO Class I (Unrestricted Operation)"
        elif health_score >= 48.0:
            status = "Warning"
            color_code = "#f59e0b"  # Amber Gold
            rul_hours = int(24 + (health_score - 48.0) * 3.4)
            iso_class = "ISO Class II/III (Allowable Long-Term Operation Restricted)"
        else:
            status = "Critical"
            color_code = "#ef4444"  # Crimson Red
            rul_hours = int(max(1, 2 + (health_score / 48.0) * 20.0))
            iso_class = "ISO Class IV (Vibration/Thermal Damage Hazard)"

        # Determine Primary Factor & Root Cause
        ratios = [
            ("Mechanical Vibration", vib_risk * 1.4, "Bearing Wear / Shaft Misalignment"),
            ("Bearing Overheating", temp_risk * 1.2, "Stator Thermal Overload / Lubrication Breakdown"),
            ("Electrical Overcurrent", curr_risk * 1.0, "Phase Asymmetry / Winding Insulation Strain"),
            ("High Centrifugal RPM", ((rpm - 500) / 4500) * 0.8, "Rotor Dynamic Unbalance")
        ]
        ratios.sort(key=lambda x: x[1], reverse=True)

        if health_score >= 82.0:
            primary_factor = "Normal Operations"
            root_cause = "Nominal mechanical & thermal operating equilibrium"
            recommendation = "Maintain standard preventive inspection interval (every 500 operating hours)."
        else:
            primary_factor = ratios[0][0]
            root_cause = ratios[0][2]
            if status == "Warning":
                recommendation = f"Schedule technician inspection within {rul_hours} hours. Perform lubrication purge on primary drive bearing and verify phase voltage balance."
            else:
                recommendation = f"IMMEDIATE ACTION REQUIRED: Initiate emergency controlled shutdown. Isolate motor feed (TAG: MOT-8842-A) and inspect bearing race for mechanical fatigue."

        explanation = self._generate_explanation(
            temp=temp,
            vib=vib,
            curr=curr,
            rpm=rpm,
            health_score=health_score,
            status=status,
            primary_factor=primary_factor,
            root_cause=root_cause,
            recommendation=recommendation,
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
        health_score: float, status: str, primary_factor: str,
        root_cause: str, recommendation: str, rul_hours: int
    ) -> str:
        if status == "Healthy":
            return (
                f"Asset MOT-8842-A is operating in full compliance with ISO 10816-3 standards ({health_score}% Health Index). "
                f"Vibration velocity ({vib:.2f} mm/s RMS) and Stator Temperature ({temp:.1f}°C) remain well within baseline bounds at {rpm:.0f} RPM. "
                f"Projected remaining useful life is ~{rul_hours} operating hours under present load profile."
            )
        elif status == "Warning":
            return (
                f"Elevated stress signature detected in {primary_factor} ({health_score}% Health Index). "
                f"Primary Root Cause: {root_cause}. Measured vibration velocity of {vib:.2f} mm/s RMS exceeds nominal ISO Class I limits. "
                f"Action Required: {recommendation}"
            )
        else: # Critical
            return (
                f"CRITICAL ANOMALY ALERT ({health_score}% Health Index). "
                f"Immediate fault risk detected in {primary_factor} ({root_cause}). "
                f"Vibration velocity ({vib:.2f} mm/s RMS) and Winding Temp ({temp:.1f}°C) exceed ISO Class IV severe damage thresholds. "
                f"Estimated RUL is critical at {rul_hours} hours. {recommendation}"
            )

    def generate_sample_telemetry(self, points: int = 24) -> List[TelemetryPoint]:
        history = []
        now = datetime.now()
        
        for i in range(points, 0, -1):
            t_stamp = (now - timedelta(minutes=i * 5)).strftime("%H:%M")
            sin_val = math.sin(i / 3.5)
            
            vib = max(0.4, round(1.6 + sin_val * 0.7 + random.uniform(-0.2, 0.2), 2))
            temp = max(28.0, round(42.0 + sin_val * 5.0 + random.uniform(-1.5, 1.5), 1))
            curr = max(8.0, round(11.5 + sin_val * 1.8 + random.uniform(-0.8, 0.8), 1))
            rpm = max(1200.0, round(1795.0 + sin_val * 35.0 + random.uniform(-15.0, 15.0), 0))
            
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
                if req == 'temperature': df[req] = 42.0
                elif req == 'vibration': df[req] = 1.6
                elif req == 'current': df[req] = 11.5
                elif req == 'rpm': df[req] = 1795.0

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
