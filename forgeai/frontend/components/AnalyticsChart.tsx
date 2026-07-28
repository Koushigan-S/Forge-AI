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
} from 'recharts';
import { Activity, Radio, Table, BarChart2 } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute telemetry summary stats
  const avgVib =
    history.length > 0
      ? (history.reduce((acc, curr) => acc + curr.vibration, 0) / history.length).toFixed(2)
      : '0.00';
  const avgTemp =
    history.length > 0
      ? (history.reduce((acc, curr) => acc + curr.temperature, 0) / history.length).toFixed(1)
      : '0.0';

  return (
    <div className="industrial-card p-5 rounded-xl border border-neutral-800 w-full h-[460px] lg:h-[500px] flex flex-col justify-between">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800 font-mono">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">
            SCADA Sensor Time-Series Stream
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend Badges */}
          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-0.5 bg-cyan-400 rounded-full" />
              <span>Vib (mm/s RMS)</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-0.5 bg-amber-400 rounded-full" />
              <span>Temp (°C)</span>
            </div>
          </div>

          {/* Chart / Table View Switcher */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5 text-[11px]">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                activeTab === 'chart' ? 'bg-cyan-600 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <BarChart2 className="w-3 h-3" />
              <span>Chart</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                activeTab === 'table' ? 'bg-cyan-600 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Table className="w-3 h-3" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="w-full h-full pt-3">
        {mounted && history && history.length > 0 ? (
          activeTab === 'chart' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#222630" vertical={false} />
                
                <XAxis
                  dataKey="timestamp"
                  stroke="#525866"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#222630' }}
                  fontFamily="monospace"
                />
                
                <YAxis
                  yAxisId="left"
                  stroke="#06b6d4"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#222630' }}
                  domain={[0, 15]}
                  unit=" mm/s"
                  fontFamily="monospace"
                />
                
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#f59e0b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#222630' }}
                  domain={[0, 120]}
                  unit="°C"
                  fontFamily="monospace"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14161a',
                    borderColor: '#262933',
                    borderRadius: '8px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                  itemStyle={{ color: '#e4e4e7' }}
                  labelStyle={{ color: '#8e96a4', fontWeight: 'bold', marginBottom: '3px' }}
                />

                {/* ISO 10816-3 Threshold Lines */}
                <ReferenceLine
                  yAxisId="left"
                  y={4.5}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{
                    value: 'ISO Warning (4.5 mm/s)',
                    fill: '#f59e0b',
                    fontSize: 9,
                    position: 'insideTopLeft',
                  }}
                />
                
                <ReferenceLine
                  yAxisId="left"
                  y={7.1}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{
                    value: 'ISO Alarm (7.1 mm/s)',
                    fill: '#ef4444',
                    fontSize: 9,
                    position: 'insideTopLeft',
                  }}
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="vibration"
                  name="Vibration Velocity"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: '#00f0ff', stroke: '#0b0c0e', strokeWidth: 2 }}
                />
                
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="temperature"
                  name="Stator Temperature"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: '#f59e0b', stroke: '#0b0c0e', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            /* Telemetry Data Table View */
            <div className="w-full h-full overflow-y-auto border border-neutral-800 rounded font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-900 border-b border-neutral-800 text-[10px] text-neutral-400 sticky top-0">
                  <tr>
                    <th className="p-2">TIMESTAMP</th>
                    <th className="p-2 text-cyan-400">VIB (mm/s)</th>
                    <th className="p-2 text-amber-400">TEMP (°C)</th>
                    <th className="p-2 text-emerald-400">CURRENT (A)</th>
                    <th className="p-2 text-purple-400">SPEED (RPM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-[11px] text-neutral-300">
                  {history.slice().reverse().map((row, i) => (
                    <tr key={i} className="hover:bg-neutral-900/50">
                      <td className="p-2 text-neutral-400">{row.timestamp}</td>
                      <td className="p-2 text-cyan-400 font-bold">{row.vibration}</td>
                      <td className="p-2 text-amber-400 font-bold">{row.temperature}</td>
                      <td className="p-2 text-emerald-400">{row.current}</td>
                      <td className="p-2 text-purple-400">{row.rpm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 font-mono text-xs">
            Loading Time-Series Buffer...
          </div>
        )}
      </div>

      {/* Footer Statistics */}
      <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
        <div>AVG VIBRATION: <span className="text-cyan-400 font-bold">{avgVib} mm/s</span></div>
        <div>AVG TEMP: <span className="text-amber-400 font-bold">{avgTemp}°C</span></div>
        <div>ISO 10816-3 SEVERITY EVALUATION</div>
      </div>
    </div>
  );
}
