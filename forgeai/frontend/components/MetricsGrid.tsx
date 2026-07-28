'use client';

import React from 'react';
import { Activity, Clock, ShieldAlert, HeartPulse, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface MetricsGridProps {
  healthScore: number;
  status: string;
  rulHours: number;
  primaryFactor: string;
  colorCode: string;
}

export default function MetricsGrid({
  healthScore,
  status,
  rulHours,
  primaryFactor,
  colorCode,
}: MetricsGridProps) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const getISOStatus = () => {
    if (healthScore >= 82) return 'ISO 10816-3 CLASS I';
    if (healthScore >= 48) return 'ISO 10816-3 CLASS II/III';
    return 'ISO 10816-3 CLASS IV';
  };

  const getStatusIcon = () => {
    if (status === 'Healthy') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (status === 'Warning') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <AlertOctagon className="w-4 h-4 text-rose-400" />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full font-mono">
      {/* Metric 1: Health Index Gauge */}
      <div className="industrial-card p-4 rounded-xl border border-neutral-800 flex items-center justify-between industrial-card-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5 text-cyan-400" />
            <span>Health Index</span>
          </div>
          <div className="text-2xl font-bold text-neutral-100">
            {healthScore}%
          </div>
          <div className="text-[10px] text-neutral-400">
            Nominal Target: &gt;82%
          </div>
        </div>

        {/* SVG Radial Progress Gauge */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="#1e222b"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke={colorCode}
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-xs font-bold text-neutral-200">
            {Math.round(healthScore)}
          </span>
        </div>
      </div>

      {/* Metric 2: Operational Severity Standard */}
      <div className="industrial-card p-4 rounded-xl border border-neutral-800 flex flex-col justify-between industrial-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Vibration Standard
          </span>
          {getStatusIcon()}
        </div>

        <div className="my-1">
          <span
            className="inline-block text-xs font-bold px-2.5 py-1 rounded border uppercase tracking-wider"
            style={{
              backgroundColor: `${colorCode}12`,
              borderColor: `${colorCode}60`,
              color: colorCode,
            }}
          >
            {status}
          </span>
        </div>

        <div className="text-[10px] text-neutral-400">
          {getISOStatus()}
        </div>
      </div>

      {/* Metric 3: Remaining Useful Life (RUL) */}
      <div className="industrial-card p-4 rounded-xl border border-neutral-800 flex flex-col justify-between industrial-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Estimated RUL
          </span>
        </div>

        <div className="my-0.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-neutral-100">
            {rulHours}
          </span>
          <span className="text-xs text-neutral-400 uppercase">
            Hours
          </span>
        </div>

        <div className="text-[10px] text-neutral-400">
          Confidence Interval: 95%
        </div>
      </div>

      {/* Metric 4: Primary Strain Factor */}
      <div className="industrial-card p-4 rounded-xl border border-neutral-800 flex flex-col justify-between industrial-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            Primary Stress Factor
          </span>
        </div>

        <div className="my-1">
          <div className="text-xs font-bold text-neutral-200 truncate">
            {primaryFactor}
          </div>
        </div>

        <div className="text-[10px] text-neutral-400">
          Dominant Telemetry Vector
        </div>
      </div>
    </div>
  );
}
