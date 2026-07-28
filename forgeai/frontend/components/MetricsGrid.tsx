'use client';

import React, { useState, useRef } from 'react';
import { Activity, Clock, ShieldAlert, HeartPulse } from 'lucide-react';

interface MetricsGridProps {
  healthScore: number;
  status: string;
  rulHours: number;
  primaryFactor: string;
  colorCode: string;
}

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease-out',
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / (rect.height / 2)) * 10; // Max 10 deg tilt
    const rotateY = (x / (rect.width / 2)) * 10; // Max 10 deg tilt

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={`glass-panel p-5 rounded-2xl border border-neutral-800 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-glow cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}

export default function MetricsGrid({
  healthScore,
  status,
  rulHours,
  primaryFactor,
  colorCode,
}: MetricsGridProps) {

  // Radial progress calculations for gauge
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  // Condition Badge Label Formatting
  const getBadgeText = () => {
    if (status === 'Healthy') return 'HEALTHY';
    if (status === 'Warning') return 'NEEDS MAINTENANCE';
    return 'CRITICAL FAILURE RISK';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {/* Card 1: Health Score Gauge */}
      <TiltCard className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400">
            <HeartPulse className="w-4 h-4 text-cyan-400" />
            <span>HEALTH SCORE</span>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-neutral-100 font-mono">
            {healthScore}%
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            Nominal Range &gt; 80%
          </div>
        </div>

        {/* SVG Circular Radial Progress Gauge */}
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#27272a"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={colorCode}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-xs font-mono font-bold text-neutral-200">
            {Math.round(healthScore)}
          </span>
        </div>
      </TiltCard>

      {/* Card 2: Predicted Condition */}
      <TiltCard className="flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            PREDICTED CONDITION
          </span>
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: colorCode }}
          />
        </div>

        <div className="my-2">
          <span
            className="inline-block text-xs font-extrabold tracking-wider px-3 py-1.5 rounded-lg uppercase border font-mono shadow-sm"
            style={{
              backgroundColor: `${colorCode}15`,
              borderColor: colorCode,
              color: colorCode,
            }}
          >
            {getBadgeText()}
          </span>
        </div>

        <div className="text-[11px] text-neutral-400 font-mono">
          AI Status Classification
        </div>
      </TiltCard>

      {/* Card 3: Remaining Useful Life (RUL) */}
      <TiltCard className="flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            REMAINING USEFUL LIFE
          </span>
        </div>

        <div className="my-1 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-neutral-100">
            {rulHours}
          </span>
          <span className="text-sm font-semibold text-neutral-400 uppercase font-mono">
            Hours
          </span>
        </div>

        <div className="text-[11px] text-neutral-400 font-mono">
          Estimated Operating Horizon
        </div>
      </TiltCard>

      {/* Card 4: Primary Risk Factor */}
      <TiltCard className="flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            PRIMARY RISK FACTOR
          </span>
        </div>

        <div className="my-1">
          <div className="text-sm font-bold text-neutral-200 line-clamp-1">
            {primaryFactor}
          </div>
        </div>

        <div className="text-[11px] text-neutral-400 font-mono">
          Dominant Stress Metric
        </div>
      </TiltCard>
    </div>
  );
}
