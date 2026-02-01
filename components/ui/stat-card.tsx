import React from "react";
import { Send, Clock, CheckCircle2, Archive } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "success" | "warning" | "muted";
}

function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const cardStyles = {
    default:
      "bg-[#0c0b0f] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]",
    success:
      "bg-[#0c0b0f] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]",
    warning:
      "bg-[#0c0b0f] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]",
    muted:
      "bg-[#0b0b0f] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
  };
  const labelColors = {
    default: "text-white/60",
    success: "text-emerald-500",
    warning: "text-yellow-400",
    muted: "text-white/60",
  };
  const iconColors = {
    default: "text-white/80",
    success: "text-emerald-500",
    warning: "text-yellow-400",
    muted: "text-white/70",
  };

  return (
    <div
      className={`relative flex h-32 flex-col justify-between rounded-[20px] p-6 ${cardStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`text-xs font-semibold tracking-[0.3em] uppercase ${labelColors[variant]}`}
        >
          {title}
        </p>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#050505]">
          <Icon className={`h-4 w-4 ${iconColors[variant]}`} />
        </div>
      </div>
      <p className="text-4xl font-semibold text-white">{value}</p>
    </div>
  );
}

export type { StatCardProps };
export { StatCard };
