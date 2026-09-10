import React, { ReactNode } from "react";
import { FolderX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  icon = <FolderX className="w-10 h-10 text-slate-500" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-command-900 border border-slate-800/80 rounded-lg">
      <div className="p-3 bg-slate-800/60 rounded-full mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
