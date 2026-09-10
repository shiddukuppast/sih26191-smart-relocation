import { HazardLevel, PriorityLevel } from "@/types";

export interface HazardMeta {
  level: HazardLevel;
  code: string;
  label: string;
  icon: string; // Emoji/icon indicator
  colorHex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  description: string;
  severityRank: number; // 0 (safest) to 4 (critical)
}

export const HAZARD_LEVELS: Record<HazardLevel, HazardMeta> = {
  0: {
    level: 0,
    code: "SAFE",
    label: "Safe",
    icon: "🟢",
    colorHex: "#10b981",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    description: "Stable conditions, minimal environmental hazard risk.",
    severityRank: 0,
  },
  1: {
    level: 1,
    code: "LOW",
    label: "Low Risk",
    icon: "🔵",
    colorHex: "#06b6d4",
    bgClass: "bg-cyan-500/10",
    textClass: "text-cyan-400",
    borderClass: "border-cyan-500/30",
    badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    description: "Low vulnerability threshold. Standard periodic monitoring.",
    severityRank: 1,
  },
  2: {
    level: 2,
    code: "MEDIUM",
    label: "Medium Risk",
    icon: "🟡",
    colorHex: "#f59e0b",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/30",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    description: "Heightened environmental sensitivity. Active monitoring required.",
    severityRank: 2,
  },
  3: {
    level: 3,
    code: "HIGH",
    label: "High Risk",
    icon: "🟠",
    colorHex: "#f97316",
    bgClass: "bg-orange-500/10",
    textClass: "text-orange-400",
    borderClass: "border-orange-500/30",
    badgeClass: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    description: "Imminent danger under heavy precipitation. Relocation staging advised.",
    severityRank: 3,
  },
  4: {
    level: 4,
    code: "RED_ZONE",
    label: "Red Zone",
    icon: "🔴",
    colorHex: "#e11d48",
    bgClass: "bg-rose-500/15",
    textClass: "text-rose-400",
    borderClass: "border-rose-500/40",
    badgeClass: "bg-rose-500/25 text-rose-300 border-rose-500/50 font-semibold",
    description: "Severe imminent hazard. Evacuation and immediate relocation mandatory.",
    severityRank: 4,
  },
};

export function getHazardMeta(level: number | HazardLevel | undefined): HazardMeta {
  if (level === undefined || level === null) return HAZARD_LEVELS[0];
  const safeLevel = Math.max(0, Math.min(4, Math.round(level))) as HazardLevel;
  return HAZARD_LEVELS[safeLevel] || HAZARD_LEVELS[0];
}

export function getHazardLabel(level: number | HazardLevel | undefined): string {
  return getHazardMeta(level).label;
}

export function getHazardIcon(level: number | HazardLevel | undefined): string {
  return getHazardMeta(level).icon;
}

export function getHazardBadgeClass(level: number | HazardLevel | undefined): string {
  return getHazardMeta(level).badgeClass;
}

export function getPriorityMeta(priority: PriorityLevel | string | undefined) {
  const norm = (priority || "").toLowerCase();
  if (norm.includes("immediate") || norm.includes("critical")) {
    return {
      label: "Immediate Action",
      icon: "🔴",
      bgClass: "bg-rose-950/60",
      textClass: "text-rose-400",
      borderClass: "border-rose-600/50",
      badgeClass: "bg-rose-600/25 text-rose-300 border-rose-600/50 font-bold",
    };
  }
  if (norm.includes("high")) {
    return {
      label: "High Priority",
      icon: "🟠",
      bgClass: "bg-orange-950/60",
      textClass: "text-orange-400",
      borderClass: "border-orange-600/50",
      badgeClass: "bg-orange-600/20 text-orange-300 border-orange-600/40",
    };
  }
  if (norm.includes("medium")) {
    return {
      label: "Medium Priority",
      icon: "🟡",
      bgClass: "bg-amber-950/60",
      textClass: "text-amber-400",
      borderClass: "border-amber-600/50",
      badgeClass: "bg-amber-600/20 text-amber-300 border-amber-600/40",
    };
  }
  return {
    label: "Low Priority",
    icon: "🟢",
    bgClass: "bg-slate-900/60",
    textClass: "text-slate-400",
    borderClass: "border-slate-700/50",
    badgeClass: "bg-slate-800 text-slate-300 border-slate-700",
  };
}
