import React, { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  statusBadge?: string;
  statusBadgeVariant?: "red" | "amber" | "emerald" | "blue";
  subtitle?: string;
  icon: ReactNode;
  href?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  trend,
  trendUp = true,
  statusBadge,
  statusBadgeVariant = "red",
  subtitle,
  icon,
  href,
  className = "",
}: StatCardProps) {
  const content = (
    <div
      className={cn(
        "bg-command-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition relative overflow-hidden group shadow-sm",
        href ? "cursor-pointer" : "",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 group-hover:text-cyan-400 transition">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-3 mb-1">
        <div className="text-2xl lg:text-3xl font-black text-slate-100 font-mono tracking-tight">
          {value}
        </div>

        {trend && (
          <div
            className={cn(
              "flex items-center text-xs font-semibold px-1.5 py-0.5 rounded",
              trendUp ? "text-rose-400 bg-rose-500/10" : "text-emerald-400 bg-emerald-500/10"
            )}
          >
            <TrendingUp className="w-3 h-3 mr-1 inline" />
            {trend}
          </div>
        )}

        {statusBadge && (
          <div
            className={cn(
              "text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border font-mono",
              statusBadgeVariant === "red"
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                : statusBadgeVariant === "amber"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            )}
          >
            {statusBadge}
          </div>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}

      {href && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-cyan-400 transition">
          <span>Inspect Registry</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
