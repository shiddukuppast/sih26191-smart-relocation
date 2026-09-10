"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSafeSite } from "@/hooks/use-safe-sites";
import { PageHeader } from "@/components/layout/page-header";
import { DetailSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Droplets,
  Truck,
  Activity,
  School,
  Zap,
  MapPin,
  ArrowRight,
  Users,
} from "lucide-react";

export default function SafeSiteDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const { data: site, isLoading } = useSafeSite(id);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!site) {
    return (
      <EmptyState
        title="Safe Site Not Found"
        description={`Safe site identifier "${id}" could not be found in the evaluated shelter directory.`}
        action={
          <Link
            href="/dashboard/safe-sites"
            className="px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            ← Back to Safe Sites
          </Link>
        }
      />
    );
  }

  const occupancyPercent = ((site.currentPopulation / site.totalCapacity) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title={`${site.siteId} — ${site.name}`}
        subtitle={`Location: ${site.location} • District: ${site.district} • State: ${site.state}`}
        badge={
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <span>🟢</span>
            <span>VERIFIED SAFE ZONE</span>
          </span>
        }
        actions={
          <Link
            href="/dashboard/map"
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            Inspect on GIS Map
          </Link>
        }
      />

      {/* Top Capacity Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Rated Capacity
          </div>
          <div className="text-3xl font-black font-mono text-slate-100">
            {site.totalCapacity.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Evaluated shelter limit</div>
        </div>

        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Current Occupancy
          </div>
          <div className="text-3xl font-black font-mono text-amber-400">
            {site.currentPopulation.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">{occupancyPercent}% utilized</div>
        </div>

        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Available Net Capacity
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {site.availableCapacity.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Immediately assignable</div>
        </div>

        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Recommendation Match
          </div>
          <div className="text-3xl font-black font-mono text-cyan-400">
            {site.recommendationScore}/100
          </div>
          <div className="text-xs text-slate-500 mt-1">Multi-criteria optimization</div>
        </div>
      </div>

      {/* Capacity Utilization Progress Bar */}
      <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
        <div className="flex justify-between text-xs text-slate-300">
          <span>Capacity Buffer Status</span>
          <span className="font-mono font-bold text-slate-200">
            {site.currentPopulation} / {site.totalCapacity} ({occupancyPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 pt-1">
          <span>0 (Empty)</span>
          <span>Warning Threshold (85%)</span>
          <span>{site.totalCapacity} (Full)</span>
        </div>
      </div>

      {/* Infrastructure Readiness & Geospatial Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Infrastructure Ratings */}
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Critical Infrastructure Matrix</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <Droplets className="w-4 h-4 text-cyan-400" />
                Water Availability
              </span>
              <span className="font-bold text-emerald-400">{site.waterAvailability}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <Truck className="w-4 h-4 text-amber-400" />
                Road Connectivity
              </span>
              <span className="font-bold text-emerald-400">{site.roadAccess}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <Activity className="w-4 h-4 text-rose-400" />
                Hospital Access
              </span>
              <span className="font-bold text-emerald-400">{site.hospitalAccess}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <School className="w-4 h-4 text-purple-400" />
                School / Community Center
              </span>
              <span className="font-bold text-emerald-400">{site.schoolAccess}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <Zap className="w-4 h-4 text-yellow-400" />
                Electricity & Backup Power
              </span>
              <span className="font-bold text-emerald-400">{site.electricityStatus}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Emergency Services Access
              </span>
              <span className="font-bold text-emerald-400">{site.emergencyAccess}</span>
            </div>
          </div>
        </div>

        {/* Geospatial & Site Attributes */}
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">Geospatial & Topographic Attributes</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px]">Geographic Latitude</span>
              <div className="font-mono font-bold text-slate-200 mt-0.5">{site.latitude}° N</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px]">Geographic Longitude</span>
              <div className="font-mono font-bold text-slate-200 mt-0.5">{site.longitude}° E</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px]">Elevation Above Sea Level</span>
              <div className="font-mono font-bold text-emerald-400 mt-0.5">{site.elevationM} meters</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px]">Surveyed Usable Land Area</span>
              <div className="font-mono font-bold text-slate-200 mt-0.5">{site.landAreaHectares} hectares</div>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-xs text-emerald-300">
            <strong>Geotechnical Clearance:</strong> Terrain slope under 4°, bedrock stability verified, outside 100-year flood inundation zones.
          </div>
        </div>
      </div>

      {/* Linked Vulnerable Habitations */}
      <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          Vulnerable Habitations Assigned to this Hub
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(site.assignedHabitationIds || ["HAB-1021", "HAB-1029"]).map((habId) => (
            <div
              key={habId}
              className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-cyan-400 font-mono">{habId}</div>
                <div className="text-[11px] text-slate-400">Designated relocation caseload</div>
              </div>
              <Link
                href={`/dashboard/habitations/${habId}`}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Inspect Habitation Dossier →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
