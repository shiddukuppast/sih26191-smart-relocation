"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  Shield,
  LogOut,
  User,
  Settings,
  AlertTriangle,
  Menu,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { DemoIndicator } from "@/components/shared/demo-indicator";
import { APP_CONFIG } from "@/lib/constants/config";
import { GlobalSearchModal } from "./global-search-modal";
import { MOCK_ALERTS } from "@/lib/mock/alerts";

export function Topbar({ onToggleMobileMenu }: { onToggleMobileMenu?: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadAlerts = MOCK_ALERTS.filter((a) => !a.isRead);

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full bg-command-900/95 backdrop-blur border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/50">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base text-white">
                  {APP_CONFIG.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40">
                  SIH 26191
                </span>
              </div>
              <div className="text-[10px] tracking-wider text-slate-400 font-semibold">
                {APP_CONFIG.department}
              </div>
            </div>
          </Link>
        </div>

        {/* Center Search Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300 transition text-xs"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search Habitation ID, Safe Site, Village...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-900 border border-slate-700 rounded text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <DemoIndicator />

          {/* Region selector */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
            <span className="text-slate-500 text-[11px]">Region:</span>
            <span className="font-semibold text-cyan-400">Karnataka Sector</span>
          </div>

          {/* Search button for small screens */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {isAlertsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-command-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Critical Operations Feed
                  </span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded font-semibold">
                    {unreadAlerts.length} Unread
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {MOCK_ALERTS.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setIsAlertsOpen(false);
                        router.push(
                          alert.relatedHabitationId
                            ? `/dashboard/habitations/${alert.relatedHabitationId}`
                            : "/dashboard/alerts"
                        );
                      }}
                      className="p-3 hover:bg-slate-800/80 cursor-pointer transition"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            alert.severity === "critical"
                              ? "bg-rose-500/20 text-rose-400"
                              : "bg-orange-500/20 text-orange-400"
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-500">{alert.timeAgo}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200 line-clamp-1">{alert.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{alert.description}</div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-800 bg-slate-950 text-center">
                  <Link
                    href="/dashboard/alerts"
                    onClick={() => setIsAlertsOpen(false)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    View All Operational Alerts →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-800 transition"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "OF"}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight">
                  {user?.name || "Command Officer"}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-command-900 border border-slate-700 rounded-lg shadow-2xl p-1.5 z-50">
                <div className="px-3 py-2 border-b border-slate-800 text-xs">
                  <div className="font-semibold text-slate-200">{user?.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{user?.badgeNumber}</div>
                </div>

                <div className="py-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded transition"
                  >
                    <User className="w-3.5 h-3.5" />
                    Officer Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded transition"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    System Settings
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out Command
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
