"use client";

import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const DATA_MAP: Record<string, any[]> = {
  today: [
    { priority: "Critical/Immediate", count: 37, color: "#e11d48" },
    { priority: "High Priority", count: 82, color: "#f97316" },
    { priority: "Medium Priority", count: 64, color: "#f59e0b" },
    { priority: "Low Priority", count: 89, color: "#06b6d4" },
  ],
  "7d": [
    { priority: "Critical/Immediate", count: 28, color: "#e11d48" },
    { priority: "High Priority", count: 74, color: "#f97316" },
    { priority: "Medium Priority", count: 71, color: "#f59e0b" },
    { priority: "Low Priority", count: 99, color: "#06b6d4" },
  ],
  "30d": [
    { priority: "Critical/Immediate", count: 19, color: "#e11d48" },
    { priority: "High Priority", count: 62, color: "#f97316" },
    { priority: "Medium Priority", count: 85, color: "#f59e0b" },
    { priority: "Low Priority", count: 106, color: "#06b6d4" },
  ],
};

export function RelocationPriorityChart() {
  const [filter, setFilter] = useState<"today" | "7d" | "30d">("today");
  const data = DATA_MAP[filter];

  return (
    <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Relocation Priority Tiers</h3>
          <p className="text-xs text-slate-500">Immediate vs scheduled evacuation caseloads</p>
        </div>

        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          {(["today", "7d", "30d"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition ${
                filter === t
                  ? "bg-slate-800 text-cyan-400 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t === "today" ? "Today" : t === "7d" ? "7 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-52 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <XAxis type="number" stroke="#475569" fontSize={11} tickLine={false} />
            <YAxis
              dataKey="priority"
              type="category"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow text-xs">
                      <div className="font-bold text-slate-200">{item.priority}</div>
                      <div className="text-slate-300 mt-1 font-mono">
                        Count: <strong>{item.count} Habitations</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <span>Triage Matrix: Multi-hazard slope & riparian calculation</span>
        <span className="text-rose-400 font-semibold font-mono">37 Urgent</span>
      </div>
    </div>
  );
}
