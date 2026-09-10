"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { useHabitations } from "@/hooks/use-habitations";
import { HazardBadge, PriorityBadge } from "@/components/shared/status-badge";
import {
  Zap,
  ShieldAlert,
  Eye,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
} from "lucide-react";

export default function AuthorityActionCenterPage() {
  const { data: habitations = [] } = useHabitations();
  const [dispatchedHabitations, setDispatchedHabitations] = useState<string[]>([]);

  const immediateHabitations = habitations.filter(
    (h) => h.priorityLevel === "Immediate" || h.hazard.overall_hazard_level === 4
  );

  const highHabitations = habitations.filter(
    (h) => h.priorityLevel === "Critical" || h.priorityLevel === "High"
  );

  const monitoringHabitations = habitations.filter(
    (h) => h.priorityLevel === "Medium" || h.priorityLevel === "Low"
  );

  const handleStartRelocation = (habitationId: string) => {
    setDispatchedHabitations((prev) => [...prev, habitationId]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Authority Action Center"
        subtitle="Priority decision matrix answering: 'What operational actions must disaster authorities execute first?'"
        badge={
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 animate-pulse">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            37 Immediate Relocations Required
          </span>
        }
      />

      {/* SECTION 1: IMMEDIATE ACTION (37 habitations) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-rose-900/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-base font-bold text-rose-400 uppercase tracking-wide">
              Immediate Action Required ({immediateHabitations.length} Habitations)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Severe Red Zone / Rapid Egress Vulnerability
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {immediateHabitations.map((h) => {
            const isDispatched = dispatchedHabitations.includes(h.habitationId);
            return (
              <div
                key={h.habitationId}
                className="bg-command-900 border-2 border-rose-600/40 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {h.habitationId}
                    </span>
                    <HazardBadge level={h.hazard.overall_hazard_level as any} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-slate-100">{h.name}</h3>
                  <div className="text-xs text-slate-400 mb-3">{h.village}, {h.district}</div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Exposed Population:</span>
                      <strong className="font-mono text-slate-200">{h.population} residents ({h.housesAffected} houses)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Relocation Priority Risk:</span>
                      <strong className="font-mono text-rose-400">{h.relocationPriorityScore}/100</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-800/80 pt-1">
                      <span className="text-slate-500">Recommended Safe Site:</span>
                      <strong className="text-emerald-400">{h.recommendedSiteId || "SAFE-204"}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <Link
                    href={`/dashboard/habitations/${h.habitationId}`}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    Review Dossier
                  </Link>

                  {isDispatched ? (
                    <div className="flex-1 py-2 px-3 rounded-lg bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Dispatched
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartRelocation(h.habitationId)}
                      className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Start Relocation
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: HIGH PRIORITY (82 habitations) */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between border-b border-orange-900/40 pb-2">
          <h2 className="text-base font-bold text-orange-400 uppercase tracking-wide flex items-center gap-2">
            <span>🟠</span>
            High Priority Staging ({highHabitations.length} Habitations)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Stage transport convoys and verify shelters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highHabitations.slice(0, 3).map((h) => (
            <div key={h.habitationId} className="bg-command-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-400 text-xs">{h.habitationId}</span>
                <PriorityBadge priority={h.priorityLevel} />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-sm">{h.name}</div>
                <div className="text-[11px] text-slate-500">{h.district} • Pop: {h.population}</div>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Risk: <strong className="text-orange-400 font-mono">{h.relocationPriorityScore}</strong></span>
                <Link
                  href={`/dashboard/habitations/${h.habitationId}`}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Review Staging →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: MONITORING (164 habitations) */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2">
            <span>🟡</span>
            Active Monitoring Habitations ({monitoringHabitations.length} Habitations)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Telemetry polling every 15 minutes</span>
        </div>

        <div className="p-4 bg-command-900 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
          <span>Currently under surveillance for rainfall threshold surges and river gauge rises.</span>
          <Link href="/dashboard/habitations" className="text-cyan-400 hover:text-cyan-300 font-semibold">
            View All in Habitations Registry →
          </Link>
        </div>
      </div>
    </div>
  );
}
