'use client';

import React, { useState, useRef } from 'react';
import { Sliders, Upload, RefreshCw, AlertCircle, Play, Layers, CheckCircle2, RotateCcw } from 'lucide-react';

interface TelemetryFormProps {
  telemetry: {
    temperature: number;
    vibration: number;
    current: number;
    rpm: number;
  };
  onChange: (field: string, value: number) => void;
  onSubmit: () => void;
  onCsvUpload: (file: File) => void;
  isLoading: boolean;
}

export default function TelemetryForm({
  telemetry,
  onChange,
  onSubmit,
  onCsvUpload,
  isLoading,
}: TelemetryFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyPreset = (preset: 'nominal' | 'warning' | 'critical') => {
    if (preset === 'nominal') {
      onChange('temperature', 38.5);
      onChange('vibration', 1.4);
      onChange('current', 11.8);
      onChange('rpm', 1790);
    } else if (preset === 'warning') {
      onChange('temperature', 68.5);
      onChange('vibration', 4.8);
      onChange('current', 22.0);
      onChange('rpm', 1780);
    } else if (preset === 'critical') {
      onChange('temperature', 104.0);
      onChange('vibration', 11.5);
      onChange('current', 41.5);
      onChange('rpm', 3450);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        setUploadedFileName(file.name);
        onCsvUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.csv')) {
        setUploadedFileName(file.name);
        onCsvUpload(file);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      {/* Left 7 Columns: Telemetry Controls & Presets */}
      <div className="lg:col-span-7 industrial-card p-5 rounded-xl border border-neutral-800 space-y-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-neutral-100 uppercase tracking-wider font-mono">
              Telemetry Parameters
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400 uppercase font-mono mr-1">Scenario Presets:</span>
            <button
              onClick={() => applyPreset('nominal')}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900/60 transition-colors"
            >
              Nominal
            </button>
            <button
              onClick={() => applyPreset('warning')}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-amber-950/60 text-amber-400 border border-amber-800/80 hover:bg-amber-900/60 transition-colors"
            >
              Warning
            </button>
            <button
              onClick={() => applyPreset('critical')}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-rose-950/60 text-rose-400 border border-rose-800/80 hover:bg-rose-900/60 transition-colors"
            >
              Critical
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Temperature */}
          <div className="bg-neutral-900/70 p-3 rounded-lg border border-neutral-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300 font-medium font-mono text-[11px]">Stator Temperature</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={20}
                  max={120}
                  step={0.5}
                  value={telemetry.temperature}
                  onChange={(e) => onChange('temperature', parseFloat(e.target.value) || 20)}
                  className="w-14 bg-neutral-950 border border-neutral-750 rounded px-1.5 py-0.5 text-xs text-right font-mono text-amber-400 font-bold focus:border-amber-500 outline-none"
                />
                <span className="text-[11px] text-neutral-400 font-mono">°C</span>
              </div>
            </div>
            <input
              type="range"
              min={20}
              max={120}
              step={0.5}
              value={telemetry.temperature}
              onChange={(e) => onChange('temperature', parseFloat(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[9px] font-mono text-neutral-500">
              <span>20°C (Nominal)</span>
              <span>120°C (Max)</span>
            </div>
          </div>

          {/* Vibration */}
          <div className="bg-neutral-900/70 p-3 rounded-lg border border-neutral-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300 font-medium font-mono text-[11px]">Vibration Velocity</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={15}
                  step={0.1}
                  value={telemetry.vibration}
                  onChange={(e) => onChange('vibration', parseFloat(e.target.value) || 0)}
                  className="w-14 bg-neutral-950 border border-neutral-750 rounded px-1.5 py-0.5 text-xs text-right font-mono text-cyan-400 font-bold focus:border-cyan-500 outline-none"
                />
                <span className="text-[11px] text-neutral-400 font-mono">mm/s</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={0.1}
              value={telemetry.vibration}
              onChange={(e) => onChange('vibration', parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] font-mono text-neutral-500">
              <span>0.0 mm/s (ISO Class I)</span>
              <span>15.0 mm/s</span>
            </div>
          </div>

          {/* Current */}
          <div className="bg-neutral-900/70 p-3 rounded-lg border border-neutral-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300 font-medium font-mono text-[11px]">Motor Current</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={5}
                  max={50}
                  step={0.5}
                  value={telemetry.current}
                  onChange={(e) => onChange('current', parseFloat(e.target.value) || 5)}
                  className="w-14 bg-neutral-950 border border-neutral-750 rounded px-1.5 py-0.5 text-xs text-right font-mono text-emerald-400 font-bold focus:border-emerald-500 outline-none"
                />
                <span className="text-[11px] text-neutral-400 font-mono">A</span>
              </div>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={0.5}
              value={telemetry.current}
              onChange={(e) => onChange('current', parseFloat(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <div className="flex justify-between text-[9px] font-mono text-neutral-500">
              <span>5.0 A (Idle)</span>
              <span>50.0 A (Overload)</span>
            </div>
          </div>

          {/* RPM */}
          <div className="bg-neutral-900/70 p-3 rounded-lg border border-neutral-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300 font-medium font-mono text-[11px]">Shaft Speed</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={500}
                  max={5000}
                  step={50}
                  value={telemetry.rpm}
                  onChange={(e) => onChange('rpm', parseFloat(e.target.value) || 500)}
                  className="w-16 bg-neutral-950 border border-neutral-750 rounded px-1.5 py-0.5 text-xs text-right font-mono text-purple-400 font-bold focus:border-purple-500 outline-none"
                />
                <span className="text-[11px] text-neutral-400 font-mono">RPM</span>
              </div>
            </div>
            <input
              type="range"
              min={500}
              max={5000}
              step={50}
              value={telemetry.rpm}
              onChange={(e) => onChange('rpm', parseFloat(e.target.value))}
              className="w-full accent-purple-400"
            />
            <div className="flex justify-between text-[9px] font-mono text-neutral-500">
              <span>500 RPM</span>
              <span>5000 RPM</span>
            </div>
          </div>
        </div>

        {/* Action Sync Button */}
        <div className="pt-1">
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-neutral-950 font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Processing ML Inference...' : 'Run Diagnostic & Twin Sync'}</span>
          </button>
        </div>
      </div>

      {/* Right 5 Columns: SCADA Batch CSV Import */}
      <div className="lg:col-span-5 industrial-card p-5 rounded-xl border border-neutral-800 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-neutral-100 uppercase tracking-wider font-mono">
              SCADA Batch Dataset Import
            </h2>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
            CSV LOGS
          </span>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`my-3 border border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/30'
              : 'border-neutral-750 hover:border-neutral-600 bg-neutral-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <Upload className="w-5 h-5 text-cyan-400 mb-1.5" />
          <span className="text-xs font-semibold text-neutral-200">
            Import Industrial CSV Sensor Stream
          </span>
          <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
            Columns: temperature, vibration, current, rpm
          </span>

          {uploadedFileName && (
            <div className="mt-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Loaded: {uploadedFileName}</span>
            </div>
          )}
        </div>

        <div className="bg-neutral-900/80 rounded-lg p-2.5 border border-neutral-800 text-[11px] text-neutral-400 font-mono flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Batch import runs time-series regression across historical frames and updates ISO anomaly thresholds automatically.
          </span>
        </div>
      </div>
    </div>
  );
}
