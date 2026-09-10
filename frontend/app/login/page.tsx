"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Shield, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants/config";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your official authorized email address.");
      return;
    }
    if (!password) {
      setError("Please enter your security access token or password.");
      return;
    }

    setLoading(true);
    try {
      await login({ email, password, rememberMe });
    } catch (err: any) {
      setError(err.message || "Invalid officer credentials. Please verify your clearance.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type: "officer" | "field") => {
    setError(null);
    setLoading(true);
    try {
      await loginAsDemo(type);
    } catch (err: any) {
      setError("Demo authentication failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-command-950 text-slate-100">
      {/* Left Column: Command Center Branding & GIS Visual */}
      <div className="md:w-1/2 p-8 lg:p-14 flex flex-col justify-between bg-gradient-to-br from-command-900 via-command-950 to-slate-950 border-b md:border-b-0 md:border-r border-slate-800 relative overflow-hidden">
        {/* Subtle GIS Grid & Topographic Contour Visual */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/60">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-black text-xl tracking-wider text-white">
                {APP_CONFIG.name}
              </div>
              <div className="text-xs font-semibold text-rose-400 tracking-wider">
                {APP_CONFIG.department}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-cyan-400 border border-slate-800 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            {APP_CONFIG.problemStatement}
          </div>

          <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-white max-w-md leading-tight mb-4">
            Detect danger.
            <br />
            Protect communities.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400">
              Relocate intelligently.
            </span>
          </h2>

          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            A mission-critical disaster management platform uniting hazard prediction models,
            vulnerability assessment, and AI-driven carrying capacity optimization for vulnerable habitations.
          </p>
        </div>

        {/* Core Pillars Visual */}
        <div className="relative z-10 my-8 space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>Automated identification of hazard-based Red Zones (Flood & Landslide)</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Multi-factor habitation vulnerability & relocation urgency prioritization</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Safe relocation destination recommendation with explainable carrying capacity</span>
          </div>
        </div>

        {/* Footer Government Disclaimer */}
        <div className="relative z-10 text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
          Prototype designed for {APP_CONFIG.organization} • NDRF DM Division
        </div>
      </div>

      {/* Right Column: Officer Sign In */}
      <div className="md:w-1/2 p-8 lg:p-14 flex flex-col justify-center items-center bg-command-950">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">
              Authorized Personnel Only
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white">Sign In to Command Center</h3>
            <p className="text-xs text-slate-400">
              Access the live regional risk dashboard and relocation dispatch terminal.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="command.officer@ndrf.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Password / Token</label>
                <span className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-0 w-4 h-4"
                />
                Remember this terminal session
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold rounded-lg text-sm transition shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Fast Demo Logins for Hackathon Judges */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
              Quick Prototype Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("officer")}
                disabled={loading}
                className="p-2.5 text-left bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg transition"
              >
                <div className="text-xs font-bold text-slate-200">NDRF Officer</div>
                <div className="text-[10px] text-slate-400">Capt. A. K. Verma</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("field")}
                disabled={loading}
                className="p-2.5 text-left bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg transition"
              >
                <div className="text-xs font-bold text-slate-200">Field Commander</div>
                <div className="text-[10px] text-slate-400">Dr. Meenakshi Rao</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
