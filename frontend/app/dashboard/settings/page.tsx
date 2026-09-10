"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/lib/auth/auth-context";
import { IS_MOCK_MODE } from "@/lib/api/client";
import { User, Bell, Map, Sliders, Server, Shield, Check, Save } from "lucide-react";
import { DemoIndicator } from "@/components/shared/demo-indicator";

export default function SystemSettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  // Form states
  const [useMock, setUseMock] = useState(IS_MOCK_MODE);
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");
  const [alertSound, setAlertSound] = useState(true);
  const [criticalSms, setCriticalSms] = useState(true);
  const [autoCenterMap, setAutoCenterMap] = useState(true);
  const [defaultCrs, setDefaultCrs] = useState("EPSG:4326");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      <PageHeader
        title="System Preferences & Dispatch Settings"
        subtitle="Manage command center officer profile, telemetry channels, and API data sources"
        actions={
          <div className="flex items-center gap-2">
            <DemoIndicator />
          </div>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Officer Profile Card */}
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <User className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Commanding Officer Profile</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Officer Name</label>
              <input
                type="text"
                disabled
                value={user?.name || "Capt. A. K. Verma"}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-300 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Designation / Role</label>
              <input
                type="text"
                disabled
                value={user?.role || "Disaster Management Officer"}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-300 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Official Clearance Email</label>
              <input
                type="text"
                disabled
                value={user?.email || "command.officer@ndrf.gov.in"}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-300 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Badge & Sector Identifier</label>
              <input
                type="text"
                disabled
                value={user?.badgeNumber || "NDRF-10BN-882"}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* API Configuration & Mode Switcher */}
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">Disaster Intelligence Backend Integration</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">FastAPI Architecture</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">DEMO MODE (Offline Synthetic Telemetry)</div>
                  <div className="text-[11px] text-slate-400">
                    Use high-fidelity mock datasets without requiring local microservices.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useMock}
                  onChange={(e) => setUseMock(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">FastAPI Server Base URL</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500">
                Member 2 Hazard Endpoint: <code className="text-cyan-400">POST /api/hazard/predict</code>
              </p>
            </div>
          </div>
        </div>

        {/* Map & GIS Preferences */}
        <div className="bg-command-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Map className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">GIS & Coordinate Projection</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Default Spatial Reference System</label>
              <select
                value={defaultCrs}
                onChange={(e) => setDefaultCrs(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="EPSG:4326">WGS 84 (EPSG:4326) — Global Standard</option>
                <option value="EPSG:3857">Web Mercator (EPSG:3857)</option>
                <option value="EPSG:7767">UTM Zone 43N (EPSG:7767) — Karnataka Regional</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={autoCenterMap}
                  onChange={(e) => setAutoCenterMap(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                Auto-center GIS view when selecting critical entities
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Preferences successfully updated
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold rounded-lg text-xs shadow-lg shadow-rose-950/50 flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            Save Command Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
