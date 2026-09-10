"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { useAlerts } from "@/hooks/use-alerts";
import { DisasterAlert, AlertSeverity, AlertCategory } from "@/types";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function OperationalAlertsPage() {
  const { data: alerts = [] } = useAlerts();
  const [localAlerts, setLocalAlerts] = useState<DisasterAlert[]>(alerts);
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  React.useEffect(() => {
    if (alerts.length > 0 && localAlerts.length === 0) {
      setLocalAlerts(alerts);
    }
  }, [alerts, localAlerts.length]);

  const displayedAlerts = localAlerts.length > 0 ? localAlerts : alerts;

  const filtered = displayedAlerts.filter((a) => {
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;
    return true;
  });

  const toggleRead = (id: string) => {
    setLocalAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: !a.isRead } : a))
    );
  };

  const markAllRead = () => {
    setLocalAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Operational Incident Alerts & Triggers"
        subtitle="Real-time multi-hazard threshold breaches, red zone triggers, and capacity alerts"
        badge={
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
            {displayedAlerts.filter((a) => !a.isRead).length} Unacknowledged Triggers
          </span>
        }
        actions={
          <button
            onClick={markAllRead}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition"
          >
            Mark All as Read
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(["all", "critical", "high", "medium", "info"] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              severityFilter === sev
                ? "bg-slate-800 text-cyan-400 border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {sev === "all" ? "All Severities" : `${sev} (${displayedAlerts.filter((a) => a.severity === sev).length})`}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              !alert.isRead
                ? "bg-command-900 border-rose-600/40 shadow-md"
                : "bg-command-900/60 border-slate-800/80 opacity-80"
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    alert.severity === "critical"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                      : alert.severity === "high"
                      ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {alert.severity}
                </span>

                <span className="text-xs font-semibold text-cyan-400 font-mono">
                  {alert.category}
                </span>

                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{alert.timeAgo}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-100">{alert.title}</h3>
              <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">{alert.description}</p>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              {alert.relatedHabitationId && (
                <Link
                  href={`/dashboard/habitations/${alert.relatedHabitationId}`}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition"
                >
                  <Eye className="w-3 h-3" />
                  Inspect Habitation
                </Link>
              )}

              {alert.relatedSiteId && (
                <Link
                  href={`/dashboard/safe-sites/${alert.relatedSiteId}`}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition"
                >
                  <Eye className="w-3 h-3" />
                  Inspect Safe Hub
                </Link>
              )}

              <button
                onClick={() => toggleRead(alert.id)}
                className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition"
                title={alert.isRead ? "Mark unread" : "Mark read"}
              >
                <CheckCircle2 className={`w-4 h-4 ${alert.isRead ? "text-emerald-400" : "text-slate-600"}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
