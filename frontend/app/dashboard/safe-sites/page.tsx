"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { useSafeSites } from "@/hooks/use-safe-sites";
import { HazardBadge } from "@/components/shared/status-badge";
import { Search, ShieldCheck, Eye, ArrowUpDown, ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function SafeSitesListPage() {
  const { data: safeSites = [], isLoading } = useSafeSites();

  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"capacity" | "available" | "score">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const districts = useMemo(() => {
    return Array.from(new Set(safeSites.map((s) => s.district))).sort();
  }, [safeSites]);

  const filteredAndSorted = useMemo(() => {
    return safeSites
      .filter((s) => {
        if (search) {
          const q = search.toLowerCase();
          const match =
            s.siteId.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q) ||
            s.location.toLowerCase().includes(q) ||
            s.district.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (districtFilter !== "all" && s.district !== districtFilter) return false;
        if (accessFilter !== "all") {
          if (accessFilter === "goodRoad" && s.roadAccess !== "Good") return false;
          if (accessFilter === "goodHospital" && s.hospitalAccess !== "Good") return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === "score") {
          valA = a.recommendationScore;
          valB = b.recommendationScore;
        } else if (sortBy === "capacity") {
          valA = a.totalCapacity;
          valB = b.totalCapacity;
        } else if (sortBy === "available") {
          valA = a.availableCapacity;
          valB = b.availableCapacity;
        }
        return sortOrder === "desc" ? valB - valA : valA - valB;
      });
  }, [safeSites, search, districtFilter, accessFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize) || 1;
  const paginated = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (col: "capacity" | "available" | "score") => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Safe Relocation Sites & Capacity Assessment"
        subtitle="Catalog of surveyed low-hazard relocation sites with carrying capacity and infrastructure ratings (Member 5)"
        badge={
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            {safeSites.length} Designated Safe Sites
          </span>
        }
      />

      {/* Filter Bar */}
      <div className="bg-command-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search SAFE-204, Kushalnagar, District..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={accessFilter}
              onChange={(e) => {
                setAccessFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Infrastructure Filters</option>
              <option value="goodRoad">Road Access: Good</option>
              <option value="goodHospital">Hospital Access: Good</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="bg-command-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Site ID</th>
                  <th className="py-3.5 px-4">Relocation Hub Name</th>
                  <th className="py-3.5 px-4">District</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition"
                    onClick={() => toggleSort("capacity")}
                  >
                    <span className="flex items-center gap-1">
                      Total Capacity
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition"
                    onClick={() => toggleSort("available")}
                  >
                    <span className="flex items-center gap-1">
                      Available Slots
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="py-3.5 px-4">Current Occ.</th>
                  <th className="py-3.5 px-4">Road</th>
                  <th className="py-3.5 px-4">Hospital</th>
                  <th className="py-3.5 px-4">Water</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition"
                    onClick={() => toggleSort("score")}
                  >
                    <span className="flex items-center gap-1">
                      Match Score
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginated.map((s) => {
                  const utilization = ((s.currentPopulation / s.totalCapacity) * 100).toFixed(0);
                  return (
                    <tr key={s.siteId} className="hover:bg-slate-850/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {s.siteId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{s.name}</div>
                        <div className="text-[11px] text-slate-500">{s.location}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-300">{s.district}</td>
                      <td className="py-3 px-4 font-mono font-medium">
                        {s.totalCapacity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {s.availableCapacity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {s.currentPopulation.toLocaleString()} ({utilization}%)
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${s.roadAccess === "Good" ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"}`}>
                          {s.roadAccess}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${s.hospitalAccess === "Good" ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"}`}>
                          {s.hospitalAccess}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${s.waterAvailability === "Good" ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"}`}>
                          {s.waterAvailability}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-cyan-400">
                          {s.recommendationScore}/100
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/dashboard/safe-sites/${s.siteId}`}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3 text-emerald-400" />
                          Dossier
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
            <div>
              Showing <span className="font-bold text-slate-200">{filteredAndSorted.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{" "}
              <span className="font-bold text-slate-200">{Math.min(page * pageSize, filteredAndSorted.length)}</span> of{" "}
              <span className="font-bold text-slate-200">{filteredAndSorted.length}</span> safe sites
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono px-2">Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
