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
import { Radio, LineChart as ChartIcon, Table as TableIcon, LayoutGrid } from 'lucide-react';

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

type ViewMode = 'graph' | 'table' | 'split';

export default function AnalyticsChart({ history }: AnalyticsChartProps) {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('graph');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-neutral-800 w-full h-[450px] lg:h-[500px] flex flex-col justify-between overflow-hidden">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-950/50 border border-cyan-800/50 rounded-lg text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-100">
              Multi-Sensor Time-Series Stream
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Live telemetry feed &amp; historical value log
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Legend Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Selector Tabs */}
          <div className="flex items-center bg-neutral-900/90 border border-neutral-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                viewMode === 'graph'
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-cyan-glow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Graph View"
            >
              <ChartIcon className="w-3.5 h-3.5" />
              <span>Graph</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                viewMode === 'table'
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-cyan-glow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                viewMode === 'split'
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-cyan-glow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Split View (Graph + Table)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
          </div>

          {/* Legend Custom Badges (Hidden in Table Mode for space) */}
          {viewMode !== 'table' && (
            <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 bg-cyan-950/30 border border-cyan-900/50 px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-cyan-300">Vib (mm/s)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-950/30 border border-amber-900/50 px-2 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-300">Temp (°C)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area: Graph, Table, or Split */}
      <div className="w-full flex-1 pt-3 overflow-hidden">
        {mounted && history && history.length > 0 ? (
          <div className="w-full h-full flex flex-col justify-between">
            {/* View Mode 1: Graph Only */}
            {viewMode === 'graph' && (
              <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                      dataKey="timestamp"
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#27272a' }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#06b6d4"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#27272a' }}
                      domain={[0, 15]}
                      unit=" mm/s"
                    />
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
              </div>
            )}

            {/* View Mode 2: Table Only */}
            {viewMode === 'table' && (
              <div className="w-full h-full overflow-y-auto pr-1 border border-neutral-800 rounded-xl bg-neutral-950/60">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="sticky top-0 bg-neutral-900 border-b border-neutral-800 text-[11px] text-neutral-400 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">TIME</th>
                      <th className="py-2.5 px-3 text-cyan-400">VIB (mm/s)</th>
                      <th className="py-2.5 px-3 text-amber-400">TEMP (°C)</th>
                      <th className="py-2.5 px-3 text-emerald-400">CURRENT (A)</th>
                      <th className="py-2.5 px-3 text-purple-400">SPEED (RPM)</th>
                      <th className="py-2.5 px-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                    {[...history].reverse().map((row, idx) => {
                      const isVibAlert = row.vibration >= 7.0;
                      const isTempAlert = row.temperature >= 85.0;
                      const isAlert = isVibAlert || isTempAlert;

                      return (
                        <tr key={idx} className="hover:bg-neutral-900/50 transition-colors">
                          <td className="py-2 px-3 font-semibold text-neutral-300">{row.timestamp}</td>
                          <td className={`py-2 px-3 font-bold ${isVibAlert ? 'text-red-400 bg-red-950/30' : 'text-cyan-400'}`}>
                            {row.vibration.toFixed(2)}
                          </td>
                          <td className={`py-2 px-3 font-bold ${isTempAlert ? 'text-red-400 bg-red-950/30' : 'text-amber-400'}`}>
                            {row.temperature.toFixed(1)}°C
                          </td>
                          <td className="py-2 px-3 text-emerald-400">{row.current.toFixed(1)} A</td>
                          <td className="py-2 px-3 text-purple-400">{Math.round(row.rpm)}</td>
                          <td className="py-2 px-3 text-right">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                                isAlert
                                  ? 'bg-red-950/60 border-red-800 text-red-400'
                                  : 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                              }`}
                            >
                              {isAlert ? 'ALERT' : 'NOMINAL'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* View Mode 3: Split View (Graph Top, Table Bottom) */}
            {viewMode === 'split' && (
              <div className="w-full h-full grid grid-rows-2 gap-3">
                {/* Upper Half: Compact Line Graph */}
                <div className="w-full h-full min-h-0 border border-neutral-800 rounded-xl bg-neutral-950/40 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="timestamp" stroke="#71717a" fontSize={9} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#06b6d4" fontSize={9} tickLine={false} domain={[0, 15]} />
                      <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={9} tickLine={false} domain={[0, 120]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#121215', borderColor: '#27272a', fontSize: '10px' }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="vibration" stroke="#06b6d4" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Lower Half: Compact Telemetry Data Table */}
                <div className="w-full h-full overflow-y-auto pr-1 border border-neutral-800 rounded-xl bg-neutral-950/60">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="sticky top-0 bg-neutral-900 border-b border-neutral-800 text-[10px] text-neutral-400 uppercase">
                      <tr>
                        <th className="py-1.5 px-2.5">TIME</th>
                        <th className="py-1.5 px-2.5 text-cyan-400">VIB (mm/s)</th>
                        <th className="py-1.5 px-2.5 text-amber-400">TEMP (°C)</th>
                        <th className="py-1.5 px-2.5 text-emerald-400">CURR (A)</th>
                        <th className="py-1.5 px-2.5 text-purple-400">RPM</th>
                        <th className="py-1.5 px-2.5 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                      {[...history].reverse().map((row, idx) => {
                        const isAlert = row.vibration >= 7.0 || row.temperature >= 85.0;
                        return (
                          <tr key={idx} className="hover:bg-neutral-900/50">
                            <td className="py-1 px-2.5 font-semibold text-neutral-300">{row.timestamp}</td>
                            <td className={`py-1 px-2.5 font-bold ${row.vibration >= 7.0 ? 'text-red-400' : 'text-cyan-400'}`}>
                              {row.vibration.toFixed(2)}
                            </td>
                            <td className={`py-1 px-2.5 font-bold ${row.temperature >= 85.0 ? 'text-red-400' : 'text-amber-400'}`}>
                              {row.temperature.toFixed(1)}°C
                            </td>
                            <td className="py-1 px-2.5 text-emerald-400">{row.current.toFixed(1)}</td>
                            <td className="py-1 px-2.5 text-purple-400">{Math.round(row.rpm)}</td>
                            <td className="py-1 px-2.5 text-right">
                              <span
                                className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                  isAlert ? 'bg-red-950/60 border-red-800 text-red-400' : 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                                }`}
                              >
                                {isAlert ? 'ALERT' : 'NOMINAL'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 font-mono text-sm">
            Initializing Telemetry Stream...
          </div>
        )}
      </div>
    </div>
  );
}
