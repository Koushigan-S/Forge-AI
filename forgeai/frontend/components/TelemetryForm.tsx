'use client';

import React, { useState, useRef } from 'react';
import { Sliders, Upload, RefreshCw, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Column 1: Manual Telemetry Sliders */}
      <div className="glass-panel p-6 rounded-2xl space-y-5 border border-neutral-800 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-neutral-100 tracking-wide">
              Manual Telemetry Controls
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">
            LIVE INPUT PARAMETERS
          </span>
        </div>

        <div className="space-y-4">
          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-neutral-300 font-medium">Temperature (°C)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400">{telemetry.temperature}°C</span>
                <input
                  type="number"
                  min={20}
                  max={120}
                  step={0.5}
                  value={telemetry.temperature}
                  onChange={(e) => onChange('temperature', parseFloat(e.target.value) || 20)}
                  className="w-16 bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-xs text-right font-mono focus:border-cyan-400 outline-none text-neutral-200"
                />
              </div>
            </div>
            <input
              type="range"
              min={20}
              max={120}
              step={0.5}
              value={telemetry.temperature}
              onChange={(e) => onChange('temperature', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
              <span>20°C (Nominal)</span>
              <span>120°C (Extreme)</span>
            </div>
          </div>

          {/* Vibration Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-neutral-300 font-medium">Vibration Velocity (mm/s)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{telemetry.vibration} mm/s</span>
                <input
                  type="number"
                  min={0}
                  max={15}
                  step={0.1}
                  value={telemetry.vibration}
                  onChange={(e) => onChange('vibration', parseFloat(e.target.value) || 0)}
                  className="w-16 bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-xs text-right font-mono focus:border-cyan-400 outline-none text-neutral-200"
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={0.1}
              value={telemetry.vibration}
              onChange={(e) => onChange('vibration', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
              <span>0.0 mm/s</span>
              <span>15.0 mm/s</span>
            </div>
          </div>

          {/* Current Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-neutral-300 font-medium">Motor Current (Amperes)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">{telemetry.current} A</span>
                <input
                  type="number"
                  min={5}
                  max={50}
                  step={0.5}
                  value={telemetry.current}
                  onChange={(e) => onChange('current', parseFloat(e.target.value) || 5)}
                  className="w-16 bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-xs text-right font-mono focus:border-cyan-400 outline-none text-neutral-200"
                />
              </div>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={0.5}
              value={telemetry.current}
              onChange={(e) => onChange('current', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
              <span>5 A</span>
              <span>50 A</span>
            </div>
          </div>

          {/* RPM Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-neutral-300 font-medium">Rotational Speed (RPM)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-400">{telemetry.rpm} RPM</span>
                <input
                  type="number"
                  min={500}
                  max={5000}
                  step={50}
                  value={telemetry.rpm}
                  onChange={(e) => onChange('rpm', parseFloat(e.target.value) || 500)}
                  className="w-16 bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-xs text-right font-mono focus:border-cyan-400 outline-none text-neutral-200"
                />
              </div>
            </div>
            <input
              type="range"
              min={500}
              max={5000}
              step={50}
              value={telemetry.rpm}
              onChange={(e) => onChange('rpm', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
              <span>500 RPM</span>
              <span>5000 RPM</span>
            </div>
          </div>
        </div>

        {/* Sync Button */}
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-sm shadow-cyan-glow flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Running Inference...' : 'Run Diagnostic & Twin Sync'}</span>
        </button>
      </div>

      {/* Column 2: CSV Batch Upload Drag & Drop Zone */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-neutral-800">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-neutral-100 tracking-wide">
              CSV Batch Telemetry Upload
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">
            BATCH DATASET
          </span>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`my-4 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/20 shadow-cyan-glow'
              : 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="p-3 bg-neutral-900 rounded-full border border-neutral-800 mb-3 text-cyan-400">
            <Upload className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-semibold text-neutral-200">
            Drag & Drop Telemetry CSV File
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
            Supports columns: <code className="text-cyan-400">temperature</code>,{' '}
            <code className="text-cyan-400">vibration</code>, <code className="text-cyan-400">current</code>,{' '}
            <code className="text-cyan-400">rpm</code>
          </p>

          {uploadedFileName && (
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Loaded: {uploadedFileName}</span>
            </div>
          )}
        </div>

        <div className="bg-neutral-900/60 rounded-xl p-3 border border-neutral-800/80 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-400 leading-relaxed">
            <span className="font-semibold text-neutral-300">Automated Pipeline:</span> Uploading a time-series CSV automatically parses historical sensor readings, updates the analytics chart, and runs ML inference on the latest batch frame.
          </div>
        </div>
      </div>
    </div>
  );
}
