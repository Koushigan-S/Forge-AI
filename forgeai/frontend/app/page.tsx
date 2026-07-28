'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Activity, ShieldCheck, Database, RefreshCcw, Download, Server } from 'lucide-react';

import DigitalTwin from '@/components/DigitalTwin';
import TelemetryForm from '@/components/TelemetryForm';
import MetricsGrid from '@/components/MetricsGrid';
import AnalyticsChart from '@/components/AnalyticsChart';
import AIDiagnostic from '@/components/AIDiagnostic';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface PredictionState {
  healthScore: number;
  status: string;
  rulHours: number;
  primaryFactor: string;
  explanation: string;
  colorCode: string;
}

interface TelemetryPoint {
  timestamp: string;
  vibration: number;
  temperature: number;
  current: number;
  rpm: number;
}

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState({
    temperature: 38.5,
    vibration: 1.4,
    current: 11.8,
    rpm: 1790.0,
  });

  const [prediction, setPrediction] = useState<PredictionState>({
    healthScore: 94.2,
    status: 'Healthy',
    rulHours: 195,
    primaryFactor: 'Normal Operations',
    explanation:
      'Asset MOT-8842-A is operating in full compliance with ISO 10816-3 standards (94.2% Health Index). Vibration velocity (1.40 mm/s RMS) and Stator Temperature (38.5°C) remain well within baseline bounds at 1790 RPM. Projected remaining useful life is ~195 operating hours under present load profile.',
    colorCode: '#10b981',
  });

  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }) +
          ' ' +
          now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/telemetry`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data.history || []);
        }
      } catch (err) {
        generateFallbackHistory();
      }
      runDiagnostic();
    };

    initData();
  }, []);

  const generateFallbackHistory = () => {
    const fallback: TelemetryPoint[] = [];
    const now = new Date();
    for (let i = 24; i >= 1; i--) {
      const t = new Date(now.getTime() - i * 5 * 60000);
      const strTime = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      fallback.push({
        timestamp: strTime,
        vibration: Number((1.4 + Math.sin(i / 3.5) * 0.4 + (Math.random() * 0.2 - 0.1)).toFixed(2)),
        temperature: Number((38.5 + Math.sin(i / 3.5) * 3.0 + (Math.random() * 1.5 - 0.75)).toFixed(1)),
        current: Number((11.8 + Math.sin(i / 3.5) * 1.0).toFixed(1)),
        rpm: Number((1790 + Math.sin(i / 3.5) * 20).toFixed(0)),
      });
    }
    setHistory(fallback);
  };

  const handleSliderChange = (field: string, value: number) => {
    setTelemetry((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const runDiagnostic = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telemetry),
      });

      if (res.ok) {
        const data = await res.json();
        setPrediction({
          healthScore: data.health_score,
          status: data.status,
          rulHours: data.rul_hours,
          primaryFactor: data.primary_factor,
          explanation: data.explanation,
          colorCode: data.color_code,
        });

        const now = new Date();
        const strTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newPoint: TelemetryPoint = {
          timestamp: strTime,
          vibration: telemetry.vibration,
          temperature: telemetry.temperature,
          current: telemetry.current,
          rpm: telemetry.rpm,
        };

        setHistory((prev) => [...prev.slice(1), newPoint]);
      } else {
        runFallbackDiagnostic();
      }
    } catch (err) {
      runFallbackDiagnostic();
    } finally {
      setIsLoading(false);
    }
  };

  const runFallbackDiagnostic = () => {
    const tempRisk = Math.max(0, (telemetry.temperature - 30.0) / 90.0);
    const vibRisk = Math.min(1.0, telemetry.vibration / 10.0);
    const currRisk = Math.max(0, (telemetry.current - 10.0) / 40.0);
    const risk = (tempRisk * 0.35) + (vibRisk * 0.45) + (currRisk * 0.20);

    const score = Number(Math.max(0, Math.min(100, (1 - risk) * 100)).toFixed(1));

    let stat = 'Healthy';
    let color = '#10b981';
    let rul = Math.round(140 + (score - 82) * 4.5);

    if (score < 48) {
      stat = 'Critical';
      color = '#ef4444';
      rul = Math.max(1, Math.round(2 + (score / 48) * 20));
    } else if (score < 82) {
      stat = 'Warning';
      color = '#f59e0b';
      rul = Math.round(24 + (score - 48) * 3.4);
    }

    let factor = 'Normal Operations';
    if (score < 82) {
      if (vibRisk >= tempRisk && vibRisk >= currRisk) factor = 'Mechanical Vibration';
      else if (tempRisk >= currRisk) factor = 'Bearing Overheating';
      else factor = 'Electrical Overcurrent';
    }

    const expl =
      stat === 'Healthy'
        ? `Asset MOT-8842-A is operating in full compliance with ISO 10816-3 standards (${score}% Health Index). Temperature (${telemetry.temperature}°C) and Vibration (${telemetry.vibration} mm/s) are nominal.`
        : stat === 'Warning'
        ? `Elevated stress detected in ${factor} (${score}% Health Index). Measured vibration (${telemetry.vibration} mm/s RMS) exceeds nominal limits. Recommend technician service within ${rul} hours.`
        : `CRITICAL FAULT ALERT (${score}% Health Index). Immediate fault risk in ${factor}. Vibration (${telemetry.vibration} mm/s) and Temp (${telemetry.temperature}°C) exceed ISO damage thresholds. Shutdown required.`;

    setPrediction({
      healthScore: score,
      status: stat,
      rulHours: rul,
      primaryFactor: factor,
      explanation: expl,
      colorCode: color,
    });
  };

  const handleCsvUpload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/upload-csv`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
        if (data.latest_prediction) {
          setPrediction({
            healthScore: data.latest_prediction.health_score,
            status: data.latest_prediction.status,
            rulHours: data.latest_prediction.rul_hours,
            primaryFactor: data.latest_prediction.primary_factor,
            explanation: data.latest_prediction.explanation,
            colorCode: data.latest_prediction.color_code,
          });

          const lastPoint = data.history[data.history.length - 1];
          if (lastPoint) {
            setTelemetry({
              temperature: lastPoint.temperature,
              vibration: lastPoint.vibration,
              current: lastPoint.current,
              rpm: lastPoint.rpm,
            });
          }
        }
      }
    } catch (err) {
      console.error('CSV upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0c0e] text-neutral-100 pb-10">
      {/* SCADA Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#121418]/90 backdrop-blur-md border-b border-neutral-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-mono">
          {/* Left Brand & Facility Info */}
          <div className="flex items-center gap-4">
            <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-neutral-50 tracking-wider">
                  FORGE<span className="text-cyan-400">AI</span>
                </h1>
                <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  SCADA V1.0
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans">
                Industrial Digital Twin &amp; Predictive Maintenance Engine
              </p>
            </div>
          </div>

          {/* Right Live Status Pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-subtle-pulse" />
              <span className="text-neutral-300 font-bold uppercase tracking-wider text-[11px]">
                SOCKET CONNECTED
              </span>
            </div>
            <div className="text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded">
              {currentTime || 'Syncing...'}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        {/* Telemetry Input Controls */}
        <section>
          <TelemetryForm
            telemetry={telemetry}
            onChange={handleSliderChange}
            onSubmit={runDiagnostic}
            onCsvUpload={handleCsvUpload}
            isLoading={isLoading}
          />
        </section>

        {/* Live Metrics Grid */}
        <section>
          <MetricsGrid
            healthScore={prediction.healthScore}
            status={prediction.status}
            rulHours={prediction.rulHours}
            primaryFactor={prediction.primaryFactor}
            colorCode={prediction.colorCode}
          />
        </section>

        {/* Central 3D Twin & Analytics Split View */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <DigitalTwin
              status={prediction.status}
              colorCode={prediction.colorCode}
              telemetry={telemetry}
            />
          </div>
          <div>
            <AnalyticsChart history={history} />
          </div>
        </section>

        {/* Explainable AI Diagnostic Card */}
        <section>
          <AIDiagnostic
            explanation={prediction.explanation}
            status={prediction.status}
            colorCode={prediction.colorCode}
          />
        </section>
      </div>
    </main>
  );
}
