"use client";

import { useState } from "react";

interface ChartDataPoint {
  label: string;
  visits: number;
  wifiConnections: number;
}

/**
 * Premium Interactive Traffic Chart Component
 * Implements HSL visual gradients, glassmorphism, and responsive states.
 */
export function TrafficChartComponent() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // High-fidelity traffic data mock
  const dataPoints: ChartDataPoint[] = [
    { label: "Mon", visits: 120, wifiConnections: 45 },
    { label: "Tue", visits: 150, wifiConnections: 65 },
    { label: "Wed", visits: 220, wifiConnections: 110 },
    { label: "Thu", visits: 180, wifiConnections: 95 },
    { label: "Fri", visits: 290, wifiConnections: 180 },
    { label: "Sat", visits: 340, wifiConnections: 240 },
    { label: "Sun", visits: 210, wifiConnections: 145 },
  ];

  const maxVal = Math.max(...dataPoints.map((d) => d.visits));

  return (
    <div className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 backdrop-blur-md shadow-lg relative overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[30%] h-[50%] bg-indigo-500/5 blur-[50px] pointer-events-none rounded-full" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Weekly Traffic & Conversion
          </h4>
          <p className="text-xs text-zinc-500">Comparing customer walk-ins with Wi-Fi signups</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-zinc-300">
            <span className="w-2.5 h-2.5 rounded bg-zinc-700 border border-zinc-600 inline-block" />
            Walk-in Traffic
          </div>
          <div className="flex items-center gap-1.5 font-medium text-indigo-400">
            <span className="w-2.5 h-2.5 rounded bg-gradient-to-tr from-indigo-500 to-purple-600 inline-block" />
            Wi-Fi Connections
          </div>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="flex items-end justify-between gap-2 h-48 pt-6 relative border-b border-zinc-800/50">
        {dataPoints.map((point, index) => {
          const visitHeightPercent = (point.visits / maxVal) * 100;
          const wifiHeightPercent = (point.wifiConnections / maxVal) * 100;

          return (
            <div
              key={point.label}
              className="flex-1 flex flex-col items-center justify-end h-full group/bar relative cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip on Hover */}
              {hoveredIndex === index && (
                <div className="absolute top-[-36px] bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-[10px] shadow-xl z-20 flex flex-col items-center gap-0.5 animate-fadeIn min-w-[80px]">
                  <span className="font-bold text-white">{point.label} Metrics</span>
                  <span className="text-zinc-400">Visits: <strong className="text-white">{point.visits}</strong></span>
                  <span className="text-indigo-400">Wifi: <strong className="text-white">{point.wifiConnections}</strong></span>
                </div>
              )}

              {/* Background Guide Line */}
              <div className="absolute inset-x-0 bottom-0 h-full w-[2px] bg-zinc-800/10 mx-auto pointer-events-none group-hover/bar:bg-indigo-500/5" />

              {/* Outer Visit Bar (Walk-ins) */}
              <div
                style={{ height: `${visitHeightPercent}%` }}
                className="w-8 sm:w-12 bg-zinc-800/60 group-hover/bar:bg-zinc-700/80 rounded-t-lg transition-all duration-300 relative flex flex-col justify-end overflow-hidden"
              >
                {/* Inner Wifi Bar (WiFi Connections) */}
                <div
                  style={{ height: `${(wifiHeightPercent / visitHeightPercent) * 100}%` }}
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 group-hover/bar:from-indigo-500 group-hover/bar:to-purple-400 rounded-t-lg transition-all duration-300 relative"
                />
              </div>

              {/* Label */}
              <span className="text-[11px] font-semibold text-zinc-500 mt-2.5 group-hover/bar:text-zinc-200 transition-colors">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
