"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Shield } from "lucide-react";
import { MAIN_NAV_ITEMS } from "@/lib/constants/navigation";
import { APP_CONFIG } from "@/lib/constants/config";
import { cn } from "@/lib/utils/cn";

export function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-command-900 border-r border-slate-800 p-4 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">{APP_CONFIG.name}</div>
                <div className="text-[10px] text-slate-400">{APP_CONFIG.department}</div>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition",
                    isActive
                      ? "bg-slate-800 text-cyan-400 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  )}
                >
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          SIH 2026 • Problem Statement 26191
        </div>
      </div>
    </div>
  );
}
