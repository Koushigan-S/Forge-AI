'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Activity, ShieldCheck, Database, RefreshCcw } from 'lucide-react';

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
    temperature: 45.0,
    vibration: 2.1,
    current: 12.0,
    rpm: 1800.0,
  });

  const [prediction, setPrediction] = useState<PredictionState>({
    healthScore: 92.4,
    status: 'Healthy',
    rulHours: 168,
    primaryFactor: 'Normal Operations',
    explanation:
      'System operating nominally. Temperature (45.0°C) and Vibration (2.10 mm/s) are within standard operational baselines for this load profile. Projected bearing degradation is minimal over the next 168 operating hours.',
    colorCode: '#06b6d4',
  });

  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Live Timestamp Updater
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
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

  // Fetch initial sample telemetry history & initial prediction
  useEffect(() => {
    const initData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/telemetry`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data.history || []);
        }
      } catch (err) {
        console.warn('Backend server offline, generating initial local history state.');
        generateFallbackHistory();
      }
      // Run initial prediction
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
        vibration: Number((2.1 + Math.sin(i / 3) * 0.5 + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        temperature: Number((45.0 + Math.sin(i / 3) * 4.0 + (Math.random() * 2 - 1)).toFixed(1)),
        current: Number((12.0 + Math.sin(i / 3) * 1.5).toFixed(1)),
        rpm: Number((1800 + Math.sin(i / 3) * 80).toFixed(0)),
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

        // Append latest telemetry point to chart stream
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
      console.warn('Backend unavailable, running client-side fallback ML calculation');
      runFallbackDiagnostic();
    } finally {
      setIsLoading(false);
    }
  };

  const runFallbackDiagnostic = () => {
    const risk =
      (telemetry.temperature / 120.0 * 0.35) +
      (telemetry.vibration / 15.0 * 0.45) +
      (telemetry.current / 50.0 * 0.20);
    const score = Number(Math.max(0, Math.min(100, (1 - risk) * 100)).toFixed(1));

    let stat = 'Healthy';
    let color = '#06b6d4';
    let rul = Math.round(120 + (score - 80) * 4);

    if (score < 45) {
      stat = 'Critical';
      color = '#ef4444';
      rul = Math.max(1, Math.round(2 + (score / 45) * 16));
    } else if (score <= 80) {
      stat = 'Warning';
      color = '#f59e0b';
      rul = Math.round(24 + (score - 45) * 1.37);
    }

    let factor = 'Normal Operations';
    if (score <= 85) {
      const vibR = telemetry.vibration / 15.0 * 1.3;
      const tempR = telemetry.temperature / 120.0 * 1.1;
      const currR = telemetry.current / 50.0 * 0.9;
      if (vibR >= tempR && vibR >= currR) factor = 'Mechanical Vibration';
      else if (tempR >= currR) factor = 'Bearing Overheating';
      else factor = 'Electrical Overcurrent';
    }

    const expl =
      stat === 'Healthy'
        ? `System operating nominally at ${score}% health score. Temperature (${telemetry.temperature}°C) and Vibration (${telemetry.vibration} mm/s) are within standard operational baselines.`
        : stat === 'Warning'
        ? `Caution: System health degraded to ${score}%. Elevated stress detected in ${factor}. Recommend scheduling preventive maintenance.`
        : `CRITICAL FAILURE RISK (${score}% Health). Imminent breakdown in ${factor}. Immediate shutdown and inspection strongly required.`;

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

          // Sync sliders to latest CSV point
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
      console.error('Failed to process CSV file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-neutral-100 pb-12">
      {/* A. Top Navigation Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-neutral-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Badge */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-neutral-950 shadow-cyan-glow">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-wider text-neutral-50 uppercase">
                  FORGE<span className="text-cyan-400">AI</span>
                </h1>
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-2 py-0.5 rounded-full">
                  V1.0 ENGINE
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Industrial Digital Twin &amp; Predictive Maintenance Engine
              </p>
            </div>
          </div>

          {/* Right Status Pill */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-3.5 py-1.5 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-status-pulse" />
              <span className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider">
                SYSTEM LIVE
              </span>
            </div>
            <div className="text-xs font-mono text-neutral-400 bg-neutral-900/50 border border-neutral-800/80 px-3 py-1.5 rounded-lg">
              {currentTime || 'Syncing clock...'}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* B. Input Control Section */}
        <section>
          <TelemetryForm
            telemetry={telemetry}
            onChange={handleSliderChange}
            onSubmit={runDiagnostic}
            onCsvUpload={handleCsvUpload}
            isLoading={isLoading}
          />
        </section>

        {/* C. Live Metrics Summary Bar */}
        <section>
          <MetricsGrid
            healthScore={prediction.healthScore}
            status={prediction.status}
            rulHours={prediction.rulHours}
            primaryFactor={prediction.primaryFactor}
            colorCode={prediction.colorCode}
          />
        </section>

        {/* D. Central Main View (Split 2-Column Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: 3D Digital Twin Canvas */}
          <div>
            <DigitalTwin
              status={prediction.status}
              colorCode={prediction.colorCode}
              telemetry={telemetry}
            />
          </div>

          {/* Right: Multi-Sensor Analytics Engine */}
          <div>
            <AnalyticsChart history={history} />
          </div>
        </section>

        {/* E. AI Diagnostic & Explainable AI Card */}
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
