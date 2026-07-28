# ForgeAI ⚡

> **Industrial Digital Twin & Predictive Maintenance Engine**

ForgeAI is an enterprise-grade AI engine and interactive 3D digital twin dashboard built to monitor industrial machinery telemetry (temperature, mechanical vibration, motor current, shaft RPM), predict Remaining Useful Life (RUL), and deliver explainable AI failure diagnostics in real time.

---

## 🎨 Features & Architecture

- **3D Digital Twin Engine**: Interactive React Three Fiber (`@react-three/fiber`) 3D industrial motor assembly with OrbitControls, live sensor HUD overlays, and real-time status light emissive reflection (Cyan for Healthy, Amber for Warning, Crimson Red for Critical).
- **Interactive Telemetry Controls**: Real-time parameter sliders with numerical input overrides and CSV drag & drop batch dataset parsing.
- **Explainable AI (XAI) Diagnostics**: Machine learning diagnostic synthesis explaining model reasoning, dominant failure factors, and maintenance suggestions in plain English.
- **Multi-Sensor Time-Series Analytics**: Recharts dual-axis chart tracking vibration and thermal curves against critical threshold boundaries.
- **FastAPI ML Backend**: Python backend running normalized parameter risk scoring, status classification, RUL regression, and batch processing.

---

## 🏗️ Repository Structure

```text
Forge-AI/
├── forgeai/
│   ├── backend/
│   │   ├── main.py              # FastAPI app & endpoints
│   │   ├── ml_engine.py         # Risk calculation & XAI generator
│   │   ├── schemas.py           # Pydantic data schemas
│   │   ├── test_backend.py      # Backend unit test suite
│   │   └── requirements.txt     # Python backend dependencies
│   └── frontend/
│       ├── app/
│       │   ├── page.tsx         # Responsive dashboard page
│       │   ├── globals.css      # Apple Industrial Dark Mode styles
│       │   └── layout.tsx       # Root Next.js layout
│       ├── components/
│       │   ├── DigitalTwin.tsx  # R3F 3D Canvas component
│       │   ├── TelemetryForm.tsx# Sliders & CSV Drag & Drop
│       │   ├── MetricsGrid.tsx  # Radial health gauge & status badges
│       │   ├── AnalyticsChart.tsx# Recharts time-series chart
│       │   └── AIDiagnostic.tsx # Explainable AI diagnostic card
│       └── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Backend Setup (FastAPI)
```bash
cd forgeai/backend
python3 -m pip install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (Next.js 14)
```bash
cd forgeai/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

### Backend Unit Tests
```bash
cd forgeai/backend
python3 test_backend.py
```

### Frontend Production Build
```bash
cd forgeai/frontend
npm run build
```
