"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, ShieldAlert, CheckCircle2 } from "lucide-react";
import { MOCK_HABITATIONS } from "@/lib/mock/habitations";
import { HazardBadge, PriorityBadge } from "@/components/shared/status-badge";

export function CriticalHabitationsTable() {
  const [search, setSearch] = useState("");

  const criticalHabitations = MOCK_HABITATIONS.filter(
    (h) =>
      h.priorityLevel === "Immediate" ||
      h.priorityLevel === "Critical" ||
      h.hazard.overall_hazard_level === 4
  );

  const filtered = criticalHabitations.filter(
    (h) =>
      h.habitationId.toLowerCase().includes(search.toLowerCase()) ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.village.toLowerCase().includes(search.toLowerCase()) ||
      h.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-command-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 lg:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <h3 className="text-base font-bold text-slate-100">Critical Habitations Requiring Relocation</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Habitations prioritized by combined hazard severity, population exposure, and terrain isolation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter critical habitations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
          <Link
            href="/dashboard/habitations"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 whitespace-nowrap"
          >
            Full Registry ({MOCK_HABITATIONS.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
            <tr>
              <th className="py-3 px-4">Habitation ID</th>
              <th className="py-3 px-4">Location & Village</th>
              <th className="py-3 px-4">Hazard Level</th>
              <th className="py-3 px-4">Population Exposed</th>
              <th className="py-3 px-4">Priority Tier</th>
              <th className="py-3 px-4">Risk Score</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.slice(0, 6).map((h) => (
              <tr key={h.habitationId} className="hover:bg-slate-850/60 transition">
                <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                  {h.habitationId}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-200">{h.name}</div>
                  <div className="text-[11px] text-slate-500">{h.village}, {h.district}</div>
                </td>
                <td className="py-3 px-4">
                  <HazardBadge level={h.hazard.overall_hazard_level as any} size="sm" />
                </td>
                <td className="py-3 px-4 font-mono font-medium">
                  {h.population.toLocaleString()} <span className="text-[11px] text-slate-500">({h.housesAffected} houses)</span>
                </td>
                <td className="py-3 px-4">
                  <PriorityBadge priority={h.priorityLevel} />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-rose-400">
                    <span>{h.relocationPriorityScore}</span>
                    <span className="text-[10px] text-slate-500">/100</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/habitations/${h.habitationId}`}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium inline-flex items-center gap-1 transition"
                    >
                      <Eye className="w-3 h-3 text-cyan-400" />
                      Dossier
                    </Link>
                    <Link
                      href={`/dashboard/relocation`}
                      className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-medium inline-flex items-center gap-1 transition"
                    >
                      Relocate
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
