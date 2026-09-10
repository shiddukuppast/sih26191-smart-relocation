"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { useRelocationCases } from "@/hooks/use-relocation";
import { PriorityBadge } from "@/components/shared/status-badge";
import { RelocationStatus } from "@/types";
import {
  ArrowRightLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function RelocationManagementPage() {
  const { data: cases = [] } = useRelocationCases();
  const [localCases, setLocalCases] = useState(cases);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  // Synchronize initial data
  React.useEffect(() => {
    if (cases.length > 0 && localCases.length === 0) {
      setLocalCases(cases);
    }
  }, [cases, localCases.length]);

  const displayedCases = localCases.length > 0 ? localCases : cases;

  const filtered = displayedCases.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (caseId: string, newStatus: RelocationStatus) => {
    setLocalCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    setSelectedCase(null);
  };

  const getStatusBadge = (status: RelocationStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "Approved":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "In Progress":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse";
      case "Completed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Relocation Operations Management"
        subtitle="Operational command for evacuating vulnerable habitations to verified carrying-capacity safe sites"
        badge={
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
            {displayedCases.length} Active Caseloads
          </span>
        }
      />

      {/* Workflow Stages Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Verification", count: displayedCases.filter((c) => c.status === "Pending").length, color: "text-amber-400" },
          { label: "Approved for Transit", count: displayedCases.filter((c) => c.status === "Approved").length, color: "text-blue-400" },
          { label: "Transit In Progress", count: displayedCases.filter((c) => c.status === "In Progress").length, color: "text-purple-400" },
          { label: "Safely Completed", count: displayedCases.filter((c) => c.status === "Completed").length, color: "text-emerald-400" },
        ].map((item) => (
          <div key={item.label} className="p-4 bg-command-900 border border-slate-800 rounded-xl">
            <div className="text-xs font-semibold text-slate-400">{item.label}</div>
            <div className={`text-2xl font-black font-mono mt-1 ${item.color}`}>
              {item.count}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(["all", "Pending", "Approved", "In Progress", "Completed"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === s
                ? "bg-slate-800 text-cyan-400 border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {s === "all" ? "All Operations" : s}
          </button>
        ))}
      </div>

      {/* Cases Table */}
      <div className="bg-command-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Source Habitation</th>
                <th className="py-3.5 px-4">Population</th>
                <th className="py-3.5 px-4">Urgency</th>
                <th className="py-3.5 px-4">Recommended Safe Destination</th>
                <th className="py-3.5 px-4">Distance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {c.caseId}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{c.sourceHabitationName}</div>
                    <div className="text-[11px] text-slate-500">{c.district} ({c.sourceHabitationId})</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {c.population} residents
                  </td>
                  <td className="py-3 px-4">
                    <PriorityBadge priority={c.priorityLevel} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-emerald-400">{c.recommendedSiteName}</div>
                    <div className="text-[11px] text-slate-500">{c.recommendedSiteId}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {c.distanceKm} km
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCase(c)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold transition"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-command-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  Operational Status Dispatch
                </span>
                <h3 className="text-base font-bold text-slate-100">{selectedCase.caseId}</h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>Source: <strong>{selectedCase.sourceHabitationName}</strong></div>
              <div>Destination: <strong className="text-emerald-400">{selectedCase.recommendedSiteName}</strong></div>
              <div>Population: <strong>{selectedCase.population}</strong></div>
              <div>Current Stage: <span className="font-bold text-cyan-400">{selectedCase.status}</span></div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Advance Operational Stage:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(["Pending", "Approved", "In Progress", "Completed"] as RelocationStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedCase.caseId, st)}
                    className={`p-2.5 rounded-lg border text-left font-semibold transition ${
                      selectedCase.status === st
                        ? "bg-slate-800 border-cyan-500 text-cyan-300"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              NDRF Standard Operating Procedure: Advancing status dispatches telemetry to field teams and district relief controllers.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
