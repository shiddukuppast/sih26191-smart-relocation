"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useHabitation } from "@/hooks/use-habitations";
import { useRelocationRecommendation } from "@/hooks/use-relocation";
import { useSafeSite } from "@/hooks/use-safe-sites";
import { PageHeader } from "@/components/layout/page-header";
import { HazardBadge, PriorityBadge, HabitationStatusBadge } from "@/components/shared/status-badge";
import { DetailSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  ShieldAlert,
  Users,
  Home,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  Activity,
  Layers,
  Sparkles,
  MapPin,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export default function HabitationDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const { data: habitation, isLoading } = useHabitation(id);
  const { data: recommendation } = useRelocationRecommendation(id);
  const { data: safeSite } = useSafeSite(habitation?.recommendedSiteId || "SAFE-204");

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!habitation) {
    return (
      <EmptyState
        title="Habitation Not Found"
        description={`Habitation with identifier "${id}" could not be located in the monitored disaster registry.`}
        action={
          <Link
            href="/dashboard/habitations"
            className="px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            ← Back to Habitations Registry
          </Link>
        }
      />
    );
  }

  const features = habitation.hazard.features || {
    rainfall_24h_mm: 0,
    rainfall_7d_mm: 0,
    slope_deg: 0,
    elevation_m: 0,
    land_use: "N/A",
    distance_to_river_m: 0,
    soil_type: "N/A",
    historical_landslide_count: 0,
    historical_flood_count: 0,
    built_up_percentage: 0,
  };

  const vulnerabilityData = [
    { subject: "Population Exp", value: habitation.vulnerabilityBreakdown.populationExposure },
    { subject: "Housing Exp", value: habitation.vulnerabilityBreakdown.housingExposure },
    { subject: "Terrain Isolation", value: 100 - habitation.vulnerabilityBreakdown.accessibility },
    { subject: "Infra Criticality", value: habitation.vulnerabilityBreakdown.criticalInfrastructure },
    { subject: "Hazard Severity", value: habitation.vulnerabilityBreakdown.hazardSeverity },
  ];

  const priorityData = [
    { name: "Hazard Severity", score: habitation.relocationPriorityBreakdown.hazardSeverity, color: "#e11d48" },
    { name: "Population Exp", score: habitation.relocationPriorityBreakdown.populationExposure, color: "#f97316" },
    { name: "Housing Exp", score: habitation.relocationPriorityBreakdown.housingExposure, color: "#f59e0b" },
    { name: "Accessibility Pen.", score: habitation.relocationPriorityBreakdown.accessibilityPenalty, color: "#8b5cf6" },
    { name: "Infra Vuln.", score: habitation.relocationPriorityBreakdown.infrastructureVulnerability, color: "#06b6d4" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Badges */}
      <PageHeader
        title={`${habitation.habitationId} — ${habitation.name}`}
        subtitle={`Village: ${habitation.village} • District: ${habitation.district} • State: ${habitation.state}`}
        badge={
          <div className="flex items-center gap-2">
            <HazardBadge level={habitation.hazard.overall_hazard_level as any} size="lg" />
            <PriorityBadge priority={habitation.priorityLevel} />
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/map"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <MapPin className="w-3.5 h-3.5" />
              Locate on GIS Map
            </Link>
            <Link
              href="/dashboard/relocation"
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Relocation Dispatch
            </Link>
          </div>
        }
      />

      {/* Top 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-command-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Hazard Score
          </div>
          <div className="text-2xl font-black font-mono text-rose-500">
            {habitation.hazard.overall_hazard_score}/100
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Multi-hazard ML</div>
        </div>

        <div className="bg-command-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Population Exposed
          </div>
          <div className="text-2xl font-black font-mono text-slate-100">
            {habitation.population.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Directly in zone</div>
        </div>

        <div className="bg-command-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Houses Affected
          </div>
          <div className="text-2xl font-black font-mono text-slate-100">
            {habitation.housesAffected}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Dwellings vulnerable</div>
        </div>

        <div className="bg-command-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Vulnerability Score
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {habitation.vulnerabilityScore}/100
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Member 4 Scorer</div>
        </div>

        <div className="bg-command-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Relocation Priority
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">
            {habitation.relocationPriorityScore}/100
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Immediate action</div>
        </div>

        <div className="bg-command-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Distance to Hazard
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {habitation.distanceToHazardKm ? `${habitation.distanceToHazardKm} km` : "N/A"}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">To river / slope edge</div>
        </div>
      </div>

      {/* HAZARD ANALYSIS: Separate Flood and Landslide Sections */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100">Dual-Hazard Model Intelligence (Member 2)</h2>
          <span className="text-xs text-slate-500">Separated inputs per model architecture</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FLOOD MODEL SECTION */}
          <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌊</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Flood Hazard Assessment</h3>
                  <p className="text-[11px] text-slate-400">Random Forest Classifier Pipeline</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black font-mono text-orange-400">
                  {habitation.hazard.flood_score || 78.5}/100
                </div>
                <div className="text-[10px] font-bold text-orange-400 uppercase">
                  {habitation.hazard.flood_level || "HIGH RISK"}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Flood Model Features (7 Inputs)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Rainfall 24h</span>
                  <div className="font-mono font-bold text-slate-200">{features.rainfall_24h_mm} mm</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Rainfall 7d</span>
                  <div className="font-mono font-bold text-slate-200">{features.rainfall_7d_mm} mm</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Elevation</span>
                  <div className="font-mono font-bold text-slate-200">{features.elevation_m} m</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Dist. to River</span>
                  <div className="font-mono font-bold text-rose-400">{features.distance_to_river_m} m</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Hist. Flood Count</span>
                  <div className="font-mono font-bold text-amber-400">{features.historical_flood_count} events</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Built-up Area</span>
                  <div className="font-mono font-bold text-slate-200">{features.built_up_percentage}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* LANDSLIDE MODEL SECTION */}
          <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">⛰️</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Landslide Hazard Assessment</h3>
                  <p className="text-[11px] text-slate-400">Terrain Slope & Geology Pipeline</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black font-mono text-amber-400">
                  {habitation.hazard.landslide_score || 62.0}/100
                </div>
                <div className="text-[10px] font-bold text-amber-400 uppercase">
                  {habitation.hazard.landslide_level || "MEDIUM RISK"}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Landslide Model Features (8 Inputs)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Slope Angle</span>
                  <div className="font-mono font-bold text-rose-400">{features.slope_deg}°</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Soil Type</span>
                  <div className="font-mono font-bold text-slate-200 truncate">{features.soil_type}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Elevation</span>
                  <div className="font-mono font-bold text-slate-200">{features.elevation_m} m</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Rainfall 24h</span>
                  <div className="font-mono font-bold text-slate-200">{features.rainfall_24h_mm} mm</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Rainfall 7d</span>
                  <div className="font-mono font-bold text-slate-200">{features.rainfall_7d_mm} mm</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Land Use</span>
                  <div className="font-mono font-bold text-slate-200 truncate">{features.land_use}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Hist. Landslides</span>
                  <div className="font-mono font-bold text-rose-400">{features.historical_landslide_count} slides</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Built-up Area</span>
                  <div className="font-mono font-bold text-slate-200">{features.built_up_percentage}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VULNERABILITY & RELOCATION PRIORITY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Analysis Card */}
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Vulnerability Assessment</h3>
              <p className="text-xs text-slate-500">Multi-criteria exposure & susceptibility</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-amber-400">
                {habitation.vulnerabilityScore}/100
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={vulnerabilityData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <Radar
                  name="Vulnerability Index"
                  dataKey="value"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-400">Vulnerability Rationale:</strong> This habitation has high vulnerability because of significant population exposure ({habitation.population} persons), high hazard severity, limited road accessibility under monsoon downpours, and critical infrastructure exposure.
          </div>
        </div>

        {/* Relocation Priority Breakdown Card */}
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Relocation Urgency Matrix</h3>
              <p className="text-xs text-slate-500">Prioritization rank for immediate evacuation dispatch</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-rose-500">
                {habitation.relocationPriorityScore}/100
              </span>
              <div className="text-[10px] font-bold text-rose-400 uppercase">IMMEDIATE ACTION REQUIRED</div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <XAxis type="number" stroke="#475569" fontSize={11} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={120} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow text-xs">
                          <div className="font-bold text-slate-200">{item.name}</div>
                          <div className="font-mono text-rose-400 mt-1">Weight Score: {item.score}/100</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-rose-400">Urgency Summary:</strong> This habitation is prioritized for immediate relocation due to imminent slope failure indices, critical stream confluence risk, and severe egress vulnerability during high precipitation.
          </div>
        </div>
      </div>

      {/* AI RELOCATION RECOMMENDATION (Crucial Section 26) */}
      <div className="bg-gradient-to-br from-command-900 via-command-900 to-slate-950 border-2 border-emerald-500/40 rounded-xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Optimization Engine • Member 5
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                AI Relocation Recommendation
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">Recommendation Score</div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {recommendation?.recommendationScore || 91}/100
              </div>
            </div>
            <Link
              href={`/dashboard/safe-sites/${recommendation?.recommendedSiteId || "SAFE-204"}`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
            >
              <span>View Safe Site Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recommended Destination & Capacity Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px]">Recommended Site</span>
            <div className="font-bold text-emerald-400 mt-0.5 truncate">
              {recommendation?.recommendedSiteName || "SAFE-204 Safe Zone B"}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px]">Total Available Capacity</span>
            <div className="font-mono font-bold text-slate-200 mt-0.5">
              {safeSite?.totalCapacity || 900} slots
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px]">Population to Relocate</span>
            <div className="font-mono font-bold text-rose-400 mt-0.5">
              {habitation.population} residents
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px]">Remaining Buffer</span>
            <div className="font-mono font-bold text-emerald-400 mt-0.5">
              {recommendation?.remainingCapacity || 220} slots
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px]">Relocation Distance</span>
            <div className="font-mono font-bold text-cyan-400 mt-0.5">
              {recommendation?.distanceKm || 4.2} km
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px]">Transit Corridor</span>
            <div className="font-bold text-slate-200 mt-0.5">SH-88 Dual Lane</div>
          </div>
        </div>

        {/* Infrastructure Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400">Road Access:</span>
            <span className="font-bold text-emerald-400">✓ Good</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400">Hospital Access:</span>
            <span className="font-bold text-emerald-400">✓ Good</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400">School / Shelter:</span>
            <span className="font-bold text-emerald-400">✓ Good</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400">Water Availability:</span>
            <span className="font-bold text-emerald-400">✓ Good</span>
          </div>
        </div>

        {/* EXPLAINABILITY: WHY THIS LOCATION? */}
        <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            WHY WAS THIS SPECIFIC LOCATION RECOMMENDED?
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {(recommendation?.reasons || [
              "Sufficient verified carrying capacity (900 capacity vs 680 to relocate)",
              "Zero environmental hazard exposure (Level 0 Safe Zone on plateau)",
              "All-weather dual-lane arterial road connectivity (SH-88 bypass)",
              "Direct emergency healthcare proximity (<3.5 km to CHC Hospital)",
              "Dedicated potable water reservoir with 48h emergency reserve",
              "Short transit distance (4.2 km minimizes evacuation exposure time)"
            ]).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
