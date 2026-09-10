"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const DATA = [
  { name: "Safe (Level 0)", value: 35, color: "#10b981", code: "SAFE" },
  { name: "Low Risk (Level 1)", value: 54, color: "#06b6d4", code: "LOW" },
  { name: "Medium Risk (Level 2)", value: 64, color: "#f59e0b", code: "MEDIUM" },
  { name: "High Risk (Level 3)", value: 82, color: "#f97316", code: "HIGH" },
  { name: "Red Zone (Level 4)", value: 37, color: "#e11d48", code: "RED_ZONE" },
];

export function HazardDistributionChart() {
  const total = DATA.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Hazard Distribution</h3>
          <p className="text-xs text-slate-500">272 Monitored Regional Habitations</p>
        </div>
        <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
          37 Red Zones
        </span>
      </div>

      <div className="h-52 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const percentage = ((item.value / total) * 100).toFixed(1);
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
                      <div className="font-bold text-slate-200">{item.name}</div>
                      <div className="text-slate-400 mt-1">
                        Habitations: <span className="text-white font-mono font-bold">{item.value}</span> ({percentage}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={DATA}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Grid Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
        {DATA.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-slate-400 truncate">{d.code}:</span>
            <span className="font-mono font-bold text-slate-200">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
