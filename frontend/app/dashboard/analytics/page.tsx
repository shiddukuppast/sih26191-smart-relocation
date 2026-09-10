"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  MOCK_HAZARD_TRENDS,
  MOCK_POPULATION_BY_HAZARD,
  MOCK_RELOCATION_STATS,
} from "@/lib/mock/analytics";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { TrendingUp, Users, ArrowRightLeft, Boxes } from "lucide-react";

export default function DisasterAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d">("today");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Disaster Intelligence Analytics"
        subtitle="Quantitative multi-hazard trends, population risk curves, and relocation velocity indicators"
        badge={
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Regional Telemetry Aggregates
          </span>
        }
        actions={
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            {(["today", "7d", "30d"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded capitalize font-medium transition ${
                  timeRange === t
                    ? "bg-slate-800 text-cyan-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t === "today" ? "24 Hours" : t === "7d" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>
        }
      />

      {/* Relocation Operations Velocity Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400">Total Cases Identified</div>
          <div className="text-2xl font-black font-mono text-slate-100 mt-1">
            {MOCK_RELOCATION_STATS.identified}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Assessed above relocation threshold</p>
        </div>
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400">Approved for Evacuation</div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1">
            {MOCK_RELOCATION_STATS.approved}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">District Magistrate authorized</p>
        </div>
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400">Active Transit In-Progress</div>
          <div className="text-2xl font-black font-mono text-purple-400 mt-1">
            {MOCK_RELOCATION_STATS.inProgress}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">En-route to designated safe sites</p>
        </div>
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400">Successfully Sheltered</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {MOCK_RELOCATION_STATS.completed}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Accounted for in biometric census</p>
        </div>
      </div>

      {/* Hazard Trends Over Time Line Chart */}
      <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Hazard Progression Dynamics</h3>
            <p className="text-xs text-slate-400">Flood vs Landslide risk progression mapped against IMD rainfall intensity</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">IMD Radar Integration</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_HAZARD_TRENDS} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded shadow text-xs">
                        <div className="font-bold text-slate-200 mb-1">Time: {payload[0].payload.time}</div>
                        <div className="text-cyan-400 font-mono">Flood Risk Index: {payload[0].value}/100</div>
                        <div className="text-amber-400 font-mono">Landslide Risk Index: {payload[1].value}/100</div>
                        <div className="text-slate-400 font-mono">Precipitation: {payload[2].value} mm/h</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Line type="monotone" dataKey="floodRisk" name="Flood Risk Score" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="landslideRisk" name="Landslide Risk Score" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="avgRainfall" name="Avg Rainfall (mm/h)" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Population Exposure by Hazard Tier Bar Chart */}
      <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Population Exposure Breakdown by Hazard Classification</h3>
            <p className="text-xs text-slate-400">Total residents within categorized environmental exposure buffers</p>
          </div>
          <span className="text-xs font-mono font-bold text-rose-400">48,620 Exposed Total</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_POPULATION_BY_HAZARD} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded shadow text-xs">
                        <div className="font-bold text-slate-100">{data.name}</div>
                        <div className="font-mono text-slate-300 mt-1">
                          Population: <strong>{data.population.toLocaleString()}</strong>
                        </div>
                        <div className="font-mono text-slate-400">
                          Habitations: <strong>{data.habitations}</strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="population" name="Population" radius={[4, 4, 0, 0]}>
                {MOCK_POPULATION_BY_HAZARD.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
