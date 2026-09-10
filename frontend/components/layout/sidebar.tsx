"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Building2,
  ShieldCheck,
  ArrowRightLeft,
  Boxes,
  BarChart3,
  AlertTriangle,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MAIN_NAV_ITEMS } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  Map: <Map className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  ArrowRightLeft: <ArrowRightLeft className="w-4 h-4" />,
  Boxes: <Boxes className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-slate-800 bg-command-900/80 backdrop-blur transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 shadow transition"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav List */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Disaster Operations
          </div>
        )}

        {MAIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition group relative",
                isActive
                  ? "bg-slate-800 text-white font-semibold shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 transition",
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                )}
              >
                {ICON_MAP[item.iconName] || <LayoutDashboard className="w-4 h-4" />}
              </div>

              {!collapsed && (
                <span className="flex-1 truncate">{item.title}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-bold font-mono",
                    item.badgeVariant === "red"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                      : item.badgeVariant === "orange"
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                      : "bg-slate-800 text-cyan-400 border border-slate-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer System Status */}
      {!collapsed ? (
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500 font-medium">GIS Risk Engine</span>
            <span className="text-emerald-400 font-mono font-semibold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Relocation Optimizer</span>
            <span className="text-cyan-400 font-mono font-semibold">ACTIVE</span>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-800 text-center">
          <span className="w-2 h-2 inline-block rounded-full bg-emerald-400" title="System Online" />
        </div>
      )}
    </aside>
  );
}
