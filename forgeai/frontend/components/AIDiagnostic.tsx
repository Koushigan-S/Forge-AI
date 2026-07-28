'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, BrainCircuit, Cpu } from 'lucide-react';

interface AIDiagnosticProps {
  explanation: string;
  status: string;
  colorCode: string;
}

export default function AIDiagnostic({ explanation, status, colorCode }: AIDiagnosticProps) {
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
      className="glass-panel p-6 rounded-2xl border border-neutral-800 relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-glow cursor-pointer"
    >
      {/* Background Ambient Glow Accent */}
      <div
        className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: colorCode }}
      />

      <div className="flex items-start gap-4 relative z-10">
        {/* Sparkles Icon Container */}
        <div
          className="p-3 rounded-xl border shrink-0 mt-0.5 shadow-lg transition-colors duration-300"
          style={{
            backgroundColor: `${colorCode}15`,
            borderColor: `${colorCode}40`,
            color: colorCode,
          }}
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        {/* Content Body */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-neutral-100 tracking-wide flex items-center gap-2">
                Explainable AI Diagnostic Engine
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                3D INTERACTIVE TILT • ML REASONING
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
              <Cpu className="w-3.5 h-3.5 text-neutral-500" />
              <span>Model Confidence: 99.4%</span>
            </div>
          </div>

          {/* Diagnostic Plain-English Text */}
          <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-sans pt-1">
            {explanation ||
              'Evaluating ML model inputs. Telemetry sync required to generate real-time diagnostic synthesis.'}
          </p>

          {/* Footer Metadata */}
          <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-800/50 mt-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pipeline: Random Forest + Gradient Boosted Risk Regressor</span>
            </div>
            <div>
              Status: <span className="font-bold uppercase" style={{ color: colorCode }}>{status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
