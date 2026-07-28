'use client';

import React, { useState } from 'react';
import { Sparkles, Cpu, Copy, Check, FileSpreadsheet, ShieldAlert } from 'lucide-react';

interface AIDiagnosticProps {
  explanation: string;
  status: string;
  colorCode: string;
}

export default function AIDiagnostic({ explanation, status, colorCode }: AIDiagnosticProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="industrial-card p-5 rounded-xl border border-neutral-800 relative overflow-hidden shadow-xl">
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* Sparkles Badge */}
        <div
          className="p-2.5 rounded-lg border shrink-0 font-mono shadow-sm"
          style={{
            backgroundColor: `${colorCode}12`,
            borderColor: `${colorCode}50`,
            color: colorCode,
          }}
        >
          <Sparkles className="w-5 h-5" />
        </div>

        {/* Diagnostic Output Content */}
        <div className="space-y-2 flex-1 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2 font-mono">
              <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">
                Explainable AI Engineering Diagnostic
              </h3>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase"
                style={{
                  backgroundColor: `${colorCode}15`,
                  borderColor: `${colorCode}60`,
                  color: colorCode,
                }}
              >
                {status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-400" />}
                <span>{copied ? 'Copied' : 'Copy Log'}</span>
              </button>
              <button
                onClick={() => alert('Exporting maintenance work order PDF...')}
                className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-cyan-400 flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>Export Work Order</span>
              </button>
            </div>
          </div>

          {/* Diagnostic Narrative Text */}
          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans pt-1">
            {explanation || 'Analyzing telemetry sensor streams. Synchronize inputs to generate diagnostic synthesis.'}
          </p>

          {/* Engineering Metadata Footer */}
          <div className="pt-2 flex flex-wrap items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-neutral-800/60 mt-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-neutral-400" />
              <span>Diagnostic Pipeline: Ensemble XGBoost + ISO 10816-3 Severity Evaluator</span>
            </div>
            <div>
              Asset: <span className="text-neutral-200 font-bold">MOT-8842-A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
