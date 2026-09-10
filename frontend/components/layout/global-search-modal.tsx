"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Building2, ShieldCheck, ArrowRightLeft, ArrowRight } from "lucide-react";
import { MOCK_HABITATIONS } from "@/lib/mock/habitations";
import { MOCK_SAFE_SITES } from "@/lib/mock/safe-sites";
import { MOCK_RELOCATION_CASES } from "@/lib/mock/relocation";
import { HazardBadge } from "@/components/shared/status-badge";

export function GlobalSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const habitations = q
    ? MOCK_HABITATIONS.filter(
        (h) =>
          h.habitationId.toLowerCase().includes(q) ||
          h.name.toLowerCase().includes(q) ||
          h.village.toLowerCase().includes(q) ||
          h.district.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const sites = q
    ? MOCK_SAFE_SITES.filter(
        (s) =>
          s.siteId.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const cases = q
    ? MOCK_RELOCATION_CASES.filter(
        (c) =>
          c.caseId.toLowerCase().includes(q) ||
          c.sourceHabitationName.toLowerCase().includes(q) ||
          c.recommendedSiteName.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const hasResults = habitations.length > 0 || sites.length > 0 || cases.length > 0;

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-command-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="relative flex items-center border-b border-slate-800 p-3.5">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Habitation ID (e.g. HAB-1021), Safe Site, Village, District..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!q && (
            <div className="p-6 text-center text-slate-500 text-xs">
              Type a habitation ID, village name, safe relocation site, or district to search immediately.
            </div>
          )}

          {q && !hasResults && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching habitations, safe sites, or cases found for &quot;<span className="text-slate-200 font-medium">{query}</span>&quot;
            </div>
          )}

          {habitations.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                Vulnerable Habitations ({habitations.length})
              </div>
              <div className="space-y-1">
                {habitations.map((h) => (
                  <div
                    key={h.habitationId}
                    onClick={() => navigateTo(`/dashboard/habitations/${h.habitationId}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <span className="text-cyan-400">{h.habitationId}</span> — {h.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {h.village}, {h.district} • Pop: {h.population.toLocaleString()} • Priority: {h.priorityLevel}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HazardBadge level={h.hazard.overall_hazard_level as any} size="sm" />
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sites.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Safe Relocation Sites ({sites.length})
              </div>
              <div className="space-y-1">
                {sites.map((s) => (
                  <div
                    key={s.siteId}
                    onClick={() => navigateTo(`/dashboard/safe-sites/${s.siteId}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <span className="text-emerald-400">{s.siteId}</span> — {s.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {s.district} • Avail Capacity: {s.availableCapacity} / {s.totalCapacity} • Match: {s.recommendationScore}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {cases.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                Relocation Operations ({cases.length})
              </div>
              <div className="space-y-1">
                {cases.map((c) => (
                  <div
                    key={c.caseId}
                    onClick={() => navigateTo(`/dashboard/relocation`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <span className="text-amber-400">{c.caseId}</span> ({c.sourceHabitationName} → {c.recommendedSiteName})
                      </div>
                      <div className="text-xs text-slate-400">
                        Status: <span className="text-slate-200 font-medium">{c.status}</span> • Pop: {c.population}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-2.5 bg-slate-950/70 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center px-4">
          <span>ProTip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Esc</kbd> to close</span>
          <span>SIH 26191 • Real-time Multi-Entity Search</span>
        </div>
      </div>
    </div>
  );
}
