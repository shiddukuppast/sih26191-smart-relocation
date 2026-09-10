"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { useCarryingCapacity } from "@/hooks/use-capacity";
import { StatCard } from "@/components/dashboard/stat-card";
import { Boxes, Building, AlertTriangle, ShieldCheck, Droplets, Truck, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function CarryingCapacityPage() {
  const { data: capacity } = useCarryingCapacity();

  const totalCap = capacity?.totalCapacity || 62400;
  const occupiedCap = capacity?.currentOccupancy || 18240;
  const availableCap = capacity?.availableCapacity || 44160;
  const utilization = ((occupiedCap / totalCap) * 100).toFixed(1);

  const districtData = capacity?.districtBreakdown || [];
  const siteData = capacity?.siteBreakdown || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Carrying Capacity Assessment"
        subtitle="Regional shelter capacity, available buffer thresholds, and resource stress analysis (Member 5)"
        badge={
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            {utilization}% Regional Utilization
          </span>
        }
      />

      {/* Top 3 High-Impact Capacity Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-command-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Relocation Capacity
            </span>
            <Boxes className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-100">
            {totalCap.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">Surveyed regional carrying limit</p>
        </div>

        <div className="bg-command-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Current Occupancy
            </span>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-400">
            {occupiedCap.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">{utilization}% currently occupied</p>
        </div>

        <div className="bg-command-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Available Net Capacity
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {availableCap.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">Immediate available emergency buffer</p>
        </div>
      </div>

      {/* District Capacity Distribution Chart */}
      <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Carrying Capacity by District</h3>
            <p className="text-xs text-slate-400">Occupied vs Available shelters across 5 Western Ghats sectors</p>
          </div>
          <div className="text-xs font-mono font-bold text-cyan-400">
            5 Monitored Districts
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="district" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded shadow text-xs">
                        <div className="font-bold text-slate-100">{data.district}</div>
                        <div className="text-emerald-400 font-mono mt-1">
                          Available: {data.availableCapacity.toLocaleString()}
                        </div>
                        <div className="text-amber-400 font-mono">
                          Occupied: {data.occupiedCapacity.toLocaleString()}
                        </div>
                        <div className="text-slate-400 font-mono mt-0.5">
                          Total: {data.totalCapacity.toLocaleString()} ({data.utilizationPercentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="occupiedCapacity" name="Occupied Capacity" stackId="a" fill="#f59e0b" />
              <Bar dataKey="availableCapacity" name="Available Capacity" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical Site Capacity Breakdown Table */}
      <div className="bg-command-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Safe Hub Capacity Stress Monitor</h3>
          <span className="text-xs text-slate-400">Shelter occupancy buffer</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3 px-4">Site ID</th>
                <th className="py-3 px-4">Safe Relocation Hub</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Total Capacity</th>
                <th className="py-3 px-4">Current Occupants</th>
                <th className="py-3 px-4">Available Slots</th>
                <th className="py-3 px-4">Capacity Load</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {siteData.map((s) => {
                const isOverloaded = s.utilizationPercentage > 85;
                return (
                  <tr key={s.siteId} className="hover:bg-slate-850/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{s.siteId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{s.name}</td>
                    <td className="py-3 px-4">{s.district}</td>
                    <td className="py-3 px-4 font-mono">{s.totalCapacity.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-amber-400">{s.currentPopulation.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{s.availableCapacity.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isOverloaded ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{ width: `${s.utilizationPercentage}%` }}
                          />
                        </div>
                        <span className={`font-mono font-semibold ${isOverloaded ? "text-rose-400" : "text-slate-300"}`}>
                          {s.utilizationPercentage}%
                        </span>
                        {isOverloaded && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
