'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Zap } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const intervalTime = 30; // Update every 30ms (~100 steps)
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          // Start fade out
          setTimeout(() => setIsFading(true), 100);
          setTimeout(() => {
            setIsHidden(true);
            if (onComplete) onComplete();
          }, 600);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (isHidden) return null;

  // Status message based on progress percentage
  const getStatusText = () => {
    if (progress < 25) return 'INITIALIZING 3D DIGITAL TWIN MODEL...';
    if (progress < 55) return 'CONNECTING FASTAPI ML INFERENCE PIPELINE...';
    if (progress < 85) return 'SYNCHRONIZING SENSOR TIME-SERIES STREAM...';
    return 'SYSTEM SYNCHRONIZED • LAUNCHING DASHBOARD...';
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#09090b] flex flex-col items-center justify-center p-6 transition-opacity duration-500 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md w-full">
        {/* Animated Brand Logo Icon */}
        <div className="relative">
          <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl text-neutral-950 shadow-cyan-glow animate-bounce">
            <Cpu className="w-10 h-10" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#09090b] animate-ping" />
        </div>

        {/* Web Name & Version Badge */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2.5">
            <h1 className="text-3xl font-black tracking-widest text-neutral-50 uppercase font-sans">
              FORGE<span className="text-cyan-400">AI</span>
            </h1>
            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded-full shadow-cyan-glow">
              V1.0 ENGINE
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono tracking-wide">
            Industrial Digital Twin &amp; Predictive Maintenance Engine
          </p>
        </div>

        {/* 1-100 Percentage Display */}
        <div className="pt-4 space-y-3 w-full">
          <div className="flex items-baseline justify-between font-mono text-sm">
            <span className="text-neutral-400 text-xs tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              {getStatusText()}
            </span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono tracking-tight shadow-cyan-glow">
              {Math.min(100, Math.floor(progress))}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/80 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-300 rounded-full transition-all duration-75 ease-linear shadow-cyan-glow"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        {/* System Footnote */}
        <div className="pt-4 flex items-center gap-2 text-[11px] font-mono text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SECURE REAL-TIME TELEMETRY ENGINE</span>
        </div>
      </div>
    </div>
  );
}
