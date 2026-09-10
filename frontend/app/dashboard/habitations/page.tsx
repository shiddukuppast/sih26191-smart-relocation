"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { useHabitations } from "@/hooks/use-habitations";
import { HazardBadge, PriorityBadge, HabitationStatusBadge } from "@/components/shared/status-badge";
import { Search, Filter, Eye, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { TableSkeleton } from "@/components/shared/loading-skeleton";

export default function HabitationsListPage() {
  const { data: habitations = [], isLoading } = useHabitations();

  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [hazardFilter, setHazardFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"priority" | "population" | "hazard">("priority");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Extract unique districts
  const districts = useMemo(() => {
    return Array.from(new Set(habitations.map((h) => h.district))).sort();
  }, [habitations]);

  const filteredAndSorted = useMemo(() => {
    return habitations
      .filter((h) => {
        if (search) {
          const q = search.toLowerCase();
          const match =
            h.habitationId.toLowerCase().includes(q) ||
            h.name.toLowerCase().includes(q) ||
            h.village.toLowerCase().includes(q) ||
            h.district.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (districtFilter !== "all" && h.district !== districtFilter) return false;
        if (hazardFilter !== "all" && h.hazard.overall_hazard_level !== Number(hazardFilter)) return false;
        if (priorityFilter !== "all" && h.priorityLevel !== priorityFilter) return false;
        if (statusFilter !== "all" && h.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === "priority") {
          valA = a.relocationPriorityScore;
          valB = b.relocationPriorityScore;
        } else if (sortBy === "population") {
          valA = a.population;
          valB = b.population;
        } else if (sortBy === "hazard") {
          valA = a.hazard.overall_hazard_score || 0;
          valB = b.hazard.overall_hazard_score || 0;
        }
        return sortOrder === "desc" ? valB - valA : valA - valB;
      });
  }, [habitations, search, districtFilter, hazardFilter, priorityFilter, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize) || 1;
  const paginated = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (column: "priority" | "population" | "hazard") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Vulnerable Habitations Registry"
        subtitle="Active inventory of regional habitations with assessed flood, landslide, and relocation urgency metrics"
        badge={
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Total: {habitations.length} Habitations
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
              placeholder="Search by ID, Habitation name, Village, or District..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* District */}
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Hazard */}
            <select
              value={hazardFilter}
              onChange={(e) => {
                setHazardFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Hazard Tiers</option>
              <option value="4">Red Zone (Level 4)</option>
              <option value="3">High Risk (Level 3)</option>
              <option value="2">Medium Risk (Level 2)</option>
              <option value="1">Low Risk (Level 1)</option>
              <option value="0">Safe (Level 0)</option>
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Priorities</option>
              <option value="Immediate">Immediate</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="Immediate">Immediate</option>
              <option value="Relocation Initiated">Relocation Initiated</option>
              <option value="Priority">Priority</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Safe">Safe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="bg-command-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Habitation ID</th>
                  <th className="py-3.5 px-4">Name & Location</th>
                  <th className="py-3.5 px-4">District</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition"
                    onClick={() => toggleSort("population")}
                  >
                    <span className="flex items-center gap-1">
                      Population
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition"
                    onClick={() => toggleSort("hazard")}
                  >
                    <span className="flex items-center gap-1">
                      Hazard Score
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="py-3.5 px-4">Hazard Level</th>
                  <th className="py-3.5 px-4">Vulnerability</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-200 transition"
                    onClick={() => toggleSort("priority")}
                  >
                    <span className="flex items-center gap-1">
                      Relocation Priority
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginated.map((h) => (
                  <tr key={h.habitationId} className="hover:bg-slate-850/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                      {h.habitationId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{h.name}</div>
                      <div className="text-[11px] text-slate-500">{h.village}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-300">
                      {h.district}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {h.population.toLocaleString()}{" "}
                      <span className="text-[11px] text-slate-500">({h.housesAffected} houses)</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      {h.hazard.overall_hazard_score}/100
                    </td>
                    <td className="py-3 px-4">
                      <HazardBadge level={h.hazard.overall_hazard_level as any} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {h.vulnerabilityScore}/100
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={h.priorityLevel} />
                    </td>
                    <td className="py-3 px-4">
                      <HabitationStatusBadge status={h.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dashboard/habitations/${h.habitationId}`}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium inline-flex items-center gap-1 transition"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" />
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
            <div>
              Showing <span className="font-bold text-slate-200">{filteredAndSorted.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{" "}
              <span className="font-bold text-slate-200">{Math.min(page * pageSize, filteredAndSorted.length)}</span> of{" "}
              <span className="font-bold text-slate-200">{filteredAndSorted.length}</span> habitations
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono px-2">
                Page {page} of {totalPages}
              </span>
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
