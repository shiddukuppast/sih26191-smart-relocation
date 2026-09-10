"use client";

import React from "react";
import {
  AlertOctagon,
  Users,
  ShieldAlert,
  Boxes,
  ShieldCheck,
  Bell,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { HazardDistributionChart } from "@/components/dashboard/hazard-distribution";
import { RelocationPriorityChart } from "@/components/dashboard/relocation-chart";
import { CriticalHabitationsTable } from "@/components/dashboard/critical-habitations";
import { RecentAlertsFeed } from "@/components/dashboard/recent-alerts";
import { SystemPipelineVisual } from "@/components/dashboard/system-pipeline";
import { useHabitations } from "@/hooks/use-habitations";
import { useSafeSites } from "@/hooks/use-safe-sites";
import { useAlerts } from "@/hooks/use-alerts";
import { useCarryingCapacity } from "@/hooks/use-capacity";

export default function DashboardOverviewPage() {
  const { data: habitations, refetch: refetchHabitations } = useHabitations();
  const { data: safeSites } = useSafeSites();
  const { data: alerts } = useAlerts();
  const { data: capacity } = useCarryingCapacity();

  const handleRefresh = () => {
    refetchHabitations();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Disaster Intelligence Command Center"
        subtitle="Live regional risk assessment, vulnerability prioritization, and relocation monitoring"
        updatedTime="Just now"
        actions={
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sync Live Telemetry</span>
          </button>
        }
      />

      {/* 6 Key Mission-Critical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="High-Risk Habitations"
          value="128"
          trend="12%"
          trendUp={true}
          icon={<AlertOctagon className="w-5 h-5 text-rose-500" />}
          subtitle="Slope & flood triggers active"
          href="/dashboard/habitations"
        />
        <StatCard
          title="Population at Risk"
          value="48,620"
          icon={<Users className="w-5 h-5 text-amber-500" />}
          subtitle="Across 5 hilly districts"
          href="/dashboard/habitations"
        />
        <StatCard
          title="Immediate Relocations"
          value="37"
          statusBadge="CRITICAL"
          statusBadgeVariant="red"
          icon={<ShieldAlert className="w-5 h-5 text-rose-500" />}
          subtitle="Red Zone urgency score ≥90"
          href="/dashboard/actions"
        />
        <StatCard
          title="Safe Relocation Capacity"
          value="62,400"
          icon={<Boxes className="w-5 h-5 text-cyan-400" />}
          subtitle="Net verified shelter capacity"
          href="/dashboard/capacity"
        />
        <StatCard
          title="Available Safe Sites"
          value="84"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          subtitle="Assessed low-risk shelters"
          href="/dashboard/safe-sites"
        />
        <StatCard
          title="Active System Alerts"
          value="16"
          statusBadge="LIVE"
          statusBadgeVariant="amber"
          icon={<Bell className="w-5 h-5 text-orange-400" />}
          subtitle="4 Critical triggers pending"
          href="/dashboard/alerts"
        />
      </div>

      {/* System Pipeline Visual: Demonstrating Unified System Architecture */}
      <SystemPipelineVisual />

      {/* Charts Row: Hazard Distribution & Relocation Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HazardDistributionChart />
        <RelocationPriorityChart />
      </div>

      {/* Critical Habitations & Recent Incident Alerts Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CriticalHabitationsTable />
        </div>
        <div className="xl:col-span-1">
          <RecentAlertsFeed />
        </div>
      </div>
    </div>
  );
}
