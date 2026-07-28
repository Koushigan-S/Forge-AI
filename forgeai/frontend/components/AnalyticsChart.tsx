'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Activity, Flame, Radio } from 'lucide-react';

interface TelemetryPoint {
  timestamp: string;
  vibration: number;
  temperature: number;
  current: number;
  rpm: number;
}

interface AnalyticsChartProps {
  history: TelemetryPoint[];
}

export default function AnalyticsChart({ history }: AnalyticsChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-neutral-800 w-full h-[450px] lg:h-[500px] flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-950/50 border border-cyan-800/50 rounded-lg text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-100">
              Multi-Sensor Time-Series Stream
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Live dual-axis telemetry telemetry feed (Vibration &amp; Thermal)
            </p>
          </div>
        </div>

        {/* Legend Custom Badges */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-cyan-950/30 border border-cyan-900/50 px-2.5 py-1 rounded-md">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-cyan-300">Vibration (mm/s)</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-900/50 px-2.5 py-1 rounded-md">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-amber-300">Temperature (°C)</span>
          </div>
        </div>
      </div>

      {/* Chart Content Area */}
      <div className="w-full h-full pt-4">
        {mounted && history && history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={history}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              
              <XAxis
                dataKey="timestamp"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#27272a' }}
              />
              
              {/* Left Y Axis for Vibration */}
              <YAxis
                yAxisId="left"
                stroke="#06b6d4"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#27272a' }}
                domain={[0, 15]}
                unit=" mm/s"
              />
              
              {/* Right Y Axis for Temperature */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f59e0b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#27272a' }}
                domain={[0, 120]}
                unit="°C"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#121215',
                  borderColor: '#27272a',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
                itemStyle={{ color: '#e4e4e7' }}
                labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', marginBottom: '4px' }}
              />

              {/* Threshold Lines */}
              <ReferenceLine
                yAxisId="left"
                y={7.0}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: 'VIB THRESHOLD (7.0 mm/s)',
                  fill: '#ef4444',
                  fontSize: 10,
                  position: 'insideTopLeft',
                }}
              />
              
              <ReferenceLine
                yAxisId="right"
                y={85.0}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: 'TEMP THRESHOLD (85°C)',
                  fill: '#ef4444',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />

              {/* Curves */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="vibration"
                name="Vibration"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#00f0ff', stroke: '#09090b', strokeWidth: 2 }}
              />
              
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: '#f59e0b', stroke: '#09090b', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 font-mono text-sm">
            Initializing Telemetry Stream...
          </div>
        )}
      </div>
    </div>
  );
}
