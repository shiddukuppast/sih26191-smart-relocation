"use client";

import React from "react";
import { IS_MOCK_MODE } from "@/lib/api/client";

export function DemoIndicator({ className = "" }: { className?: string }) {
  if (IS_MOCK_MODE) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 tracking-wide select-none ${className}`}
        title="Running in synthetic DEMO MODE for presentation & offline resilience. No live backend required."
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        DEMO DATA
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 tracking-wide select-none ${className}`}
      title="Connected to live FastAPI backend."
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400" />
      LIVE BACKEND
    </div>
  );
}
