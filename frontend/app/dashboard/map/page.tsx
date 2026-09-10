"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { RiskMap } from "@/components/map/risk-map";
import { MapLegend } from "@/components/map/map-legend";
import { useHabitations } from "@/hooks/use-habitations";
import { useSafeSites } from "@/hooks/use-safe-sites";
import {
  Layers,
  Search,
  Filter,
  RotateCcw,
  Shield,
  Eye,
  Building2,
  ShieldCheck,
  CheckSquare,
  Square,
} from "lucide-react";
import { HazardBadge, PriorityBadge } from "@/components/shared/status-badge";

export default function GisRiskMapPage() {
  const { data: habitations = [] } = useHabitations();
  const { data: safeSites = [] } = useSafeSites();

  // Search & Filter States
  const [search, setSearch] = useState("");
  const [hazardFilter, setHazardFilter] = useState<string>("all");
  const [populationFilter, setPopulationFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // Layers Visibility State
  const [layerVisibility, setLayerVisibility] = useState({
    hazardZones: true,
    habitations: true,
    safeSites: true,
    rivers: true,
    roads: true,
    hospitals: true,
    schools: true,
    satellite: false,
  });

  const toggleLayer = (layerKey: keyof typeof layerVisibility) => {
    setLayerVisibility((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const resetFilters = () => {
    setSearch("");
    setHazardFilter("all");
    setPopulationFilter("all");
    setPriorityFilter("all");
    setSelectedEntityId(null);
  };

  // Filtered Habitations
  const filteredHabitations = useMemo(() => {
    return habitations.filter((h) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matches =
          h.habitationId.toLowerCase().includes(q) ||
          h.name.toLowerCase().includes(q) ||
          h.village.toLowerCase().includes(q) ||
          h.district.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Hazard Level
      if (hazardFilter !== "all") {
        if (h.hazard.overall_hazard_level !== Number(hazardFilter)) return false;
      }

      // Population
      if (populationFilter === "under500" && h.population >= 500) return false;
      if (populationFilter === "500to1000" && (h.population < 500 || h.population > 1000)) return false;
      if (populationFilter === "over1000" && h.population <= 1000) return false;

      // Priority
      if (priorityFilter !== "all" && h.priorityLevel !== priorityFilter) return false;

      return true;
    });
  }, [habitations, search, hazardFilter, populationFilter, priorityFilter]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200 flex flex-col h-[calc(100vh-6rem)]">
      <PageHeader
        title="Interactive GIS Risk & Relocation Map"
        subtitle="Geospatial situational awareness, terrain hazard zones, and candidate relocation sites"
        updatedTime="Real-time GIS Stream"
        badge={
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            WGS 84 / EPSG:4326
          </span>
        }
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        {/* Left Map Controls & Filter Sidebar */}
        <div className="lg:col-span-1 bg-command-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-y-auto space-y-4 shadow-sm">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                Find Habitation / Safe Site
              </label>
              <input
                type="text"
                placeholder="Search HAB-1021, Village A, Kodagu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Layer Visibility Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                GIS Map Layers
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                {[
                  { key: "hazardZones", label: "🔴 Red & High Risk Zones" },
                  { key: "habitations", label: "🏘 Vulnerable Habitations" },
                  { key: "safeSites", label: "🏠 Candidate Safe Sites" },
                  { key: "rivers", label: "🌊 Rivers & Drainage Basins" },
                  { key: "roads", label: "🛣 Arterial Evacuation Roads" },
                  { key: "hospitals", label: "🏥 Emergency Hospitals" },
                  { key: "schools", label: "🏫 Relief Shelter Schools" },
                  { key: "satellite", label: "🛰 Satellite Imagery Base" },
                ].map(({ key, label }) => {
                  const isChecked = layerVisibility[key as keyof typeof layerVisibility];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleLayer(key as keyof typeof layerVisibility)}
                      className="w-full flex items-center justify-between p-1.5 rounded hover:bg-slate-800/80 transition text-left"
                    >
                      <span className="text-slate-300">{label}</span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  Attribute Filters
                </span>
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-normal flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Hazard Level */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Hazard Level</label>
                <select
                  value={hazardFilter}
                  onChange={(e) => setHazardFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Hazard Levels</option>
                  <option value="4">Red Zone (Level 4)</option>
                  <option value="3">High Risk (Level 3)</option>
                  <option value="2">Medium Risk (Level 2)</option>
                  <option value="1">Low Risk (Level 1)</option>
                  <option value="0">Safe (Level 0)</option>
                </select>
              </div>

              {/* Population Exposed */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Population Exposed</label>
                <select
                  value={populationFilter}
                  onChange={(e) => setPopulationFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Population Sizes</option>
                  <option value="under500">Under 500 residents</option>
                  <option value="500to1000">500 – 1,000 residents</option>
                  <option value="over1000">Over 1,000 residents</option>
                </select>
              </div>

              {/* Relocation Priority */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Relocation Urgency</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Priority Tiers</option>
                  <option value="Immediate">Immediate Evacuation</option>
                  <option value="Critical">Critical Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary Footer */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Visible Habitations:</span>
              <strong className="font-mono text-cyan-400">{filteredHabitations.length}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Candidate Safe Sites:</span>
              <strong className="font-mono text-emerald-400">{safeSites.length}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Red Zones Filtered:</span>
              <strong className="font-mono text-rose-400">
                {filteredHabitations.filter((h) => h.hazard.overall_hazard_level === 4).length}
              </strong>
            </div>
          </div>
        </div>

        {/* Right Map Canvas & Legend Overlay */}
        <div className="lg:col-span-3 relative h-full min-h-[550px] bg-command-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
          <RiskMap
            habitations={filteredHabitations}
            safeSites={safeSites}
            selectedId={selectedEntityId}
            layerVisibility={layerVisibility}
          />

          {/* Floating Map Legend in Bottom-Right */}
          <div className="absolute bottom-4 right-4 z-20 max-w-xs">
            <MapLegend />
          </div>
        </div>
      </div>
    </div>
  );
}
