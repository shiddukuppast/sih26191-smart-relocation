import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { MOCK_ALERTS } from "@/lib/mock/alerts";

export function RecentAlertsFeed() {
  return (
    <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-slate-200">Incident Feed & Live Triggers</h3>
        </div>
        <Link
          href="/dashboard/alerts"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          View All ({MOCK_ALERTS.length})
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {MOCK_ALERTS.slice(0, 4).map((alert) => (
          <div
            key={alert.id}
            className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                  alert.severity === "critical"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                }`}
              >
                {alert.severity} • {alert.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{alert.timeAgo}</span>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-200 mt-1">{alert.title}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{alert.description}</div>

            {alert.relatedHabitationId && (
              <div className="mt-2 pt-2 border-t border-slate-900 flex justify-end">
                <Link
                  href={`/dashboard/habitations/${alert.relatedHabitationId}`}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Inspect {alert.relatedHabitationId} →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
