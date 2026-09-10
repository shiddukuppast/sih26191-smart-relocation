import React from "react";

export function MapLegend() {
  return (
    <div className="bg-command-900/95 border border-slate-800 rounded-xl p-3.5 shadow-xl text-xs space-y-2.5 backdrop-blur">
      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center justify-between">
        <span>Map Legend</span>
        <span className="text-[10px] text-slate-500 font-mono">EPSG:4326</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-600 border border-white/80 shadow" />
          <span className="text-slate-300 font-medium">🔴 Red Zone (Hazard Lv 4)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 border border-white/80 shadow" />
          <span className="text-slate-300">🟠 High Risk (Hazard Lv 3)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white/80 shadow" />
          <span className="text-slate-300">🟡 Medium Risk (Hazard Lv 2)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-500 border border-white/80 shadow" />
          <span className="text-slate-300">🟢 Low Risk / Safe (Lv 0-1)</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white/80 shadow" />
          <span className="text-emerald-400 font-semibold">🏠 Safe Relocation Site</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-cyan-400 rounded-full" />
          <span className="text-slate-300">🌊 River / Drainage Basin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-amber-400 border-dashed border-t-2" />
          <span className="text-slate-300">🛣 Evacuation Highway</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">🏥</span>
          <span className="text-slate-300">Emergency Hospital</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">🏫</span>
          <span className="text-slate-300">School Relief Shelter</span>
        </div>
      </div>
    </div>
  );
}
