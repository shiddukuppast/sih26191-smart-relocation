import React from "react";
import { HazardLevel, PriorityLevel, HabitationStatus } from "@/types";
import { getHazardMeta, getPriorityMeta } from "@/lib/constants/hazard-level";
import { cn } from "@/lib/utils/cn";

export function HazardBadge({
  level,
  className = "",
  size = "md",
}: {
  level: HazardLevel | number | undefined;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const meta = getHazardMeta(level);
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium",
        meta.badgeClass,
        sizeClasses,
        className
      )}
    >
      <span className="text-xs">{meta.icon}</span>
      <span>{meta.label.toUpperCase()}</span>
    </span>
  );
}

export function PriorityBadge({
  priority,
  className = "",
}: {
  priority: PriorityLevel | string | undefined;
  className?: string;
}) {
  const meta = getPriorityMeta(priority);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold",
        meta.badgeClass,
        className
      )}
    >
      <span className="text-xs">{meta.icon}</span>
      <span>{meta.label.toUpperCase()}</span>
    </span>
  );
}

export function HabitationStatusBadge({
  status,
  className = "",
}: {
  status: HabitationStatus | string;
  className?: string;
}) {
  let style = "bg-slate-800 text-slate-300 border-slate-700";
  if (status === "Immediate") style = "bg-rose-950/80 text-rose-300 border-rose-600/60 font-bold animate-pulse";
  else if (status === "Relocation Initiated") style = "bg-blue-950/80 text-blue-300 border-blue-600/60 font-medium";
  else if (status === "Priority") style = "bg-orange-950/80 text-orange-300 border-orange-600/60";
  else if (status === "Monitoring") style = "bg-amber-950/80 text-amber-300 border-amber-600/60";
  else if (status === "Relocated") style = "bg-emerald-950/80 text-emerald-300 border-emerald-600/60";
  else if (status === "Safe") style = "bg-emerald-950/80 text-emerald-300 border-emerald-600/60";

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium", style, className)}>
      {status}
    </span>
  );
}
