import React from "react";
import { ArrowRight, Database, Brain, Map, Users, ShieldAlert, Building, Target, CheckCircle2 } from "lucide-react";

export function SystemPipelineVisual() {
  const steps = [
    { title: "DATA SOURCES", subtitle: "Rainfall, DEM, Soil", icon: <Database className="w-4 h-4 text-blue-400" /> },
    { title: "HAZARD ML", subtitle: "Flood & Landslide", icon: <Brain className="w-4 h-4 text-purple-400" /> },
    { title: "GIS MAPPING", subtitle: "Spatial Red Zones", icon: <Map className="w-4 h-4 text-cyan-400" /> },
    { title: "VULNERABILITY", subtitle: "Multi-factor Scorer", icon: <Users className="w-4 h-4 text-amber-400" /> },
    { title: "PRIORITIZATION", subtitle: "Relocation Rank", icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
    { title: "SAFE SITES", subtitle: "Carrying Capacity", icon: <Building className="w-4 h-4 text-emerald-400" /> },
    { title: "OPTIMIZATION", subtitle: "AI Recommendation", icon: <Target className="w-4 h-4 text-indigo-400" /> },
    { title: "AUTHORITY ACTION", subtitle: "Field Relocation", icon: <CheckCircle2 className="w-4 h-4 text-teal-400" /> },
  ];

  return (
    <div className="bg-command-900/60 border border-slate-800 rounded-xl p-4 shadow-sm my-6">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
        Integrated System Pipeline Architecture (SIH 26191)
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((s, idx) => (
          <div
            key={s.title}
            className="flex flex-col items-center text-center p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 relative group hover:border-slate-700 transition"
          >
            <div className="p-2 rounded-md bg-slate-900 border border-slate-800 mb-2">
              {s.icon}
            </div>
            <span className="text-[10px] font-bold text-slate-200 leading-tight">{s.title}</span>
            <span className="text-[9px] text-slate-500 mt-0.5 truncate max-w-full">{s.subtitle}</span>

            {idx < steps.length - 1 && (
              <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-600 z-10">
                <ArrowRight className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
