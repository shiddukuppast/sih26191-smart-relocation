import React, { ReactNode } from "react";
import { Clock, MapPin } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  updatedTime?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  updatedTime = "2 minutes ago",
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-100">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="text-xs lg:text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/90 px-3 py-1.5 rounded-md border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last updated: <strong className="text-slate-300 font-medium">{updatedTime}</strong></span>
        </div>
        {actions}
      </div>
    </div>
  );
}
