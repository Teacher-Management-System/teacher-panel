"use client";

import { Megaphone, X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface AnnouncementNotificationToastProps {
  id: string | number;
  title: string;
  description: string;
  onClick?: () => void;
}

export function AnnouncementNotificationToast({
  id,
  title,
  description,
  onClick,
}: AnnouncementNotificationToastProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
      toast.dismiss(id);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`flex flex-col w-full max-w-[400px] bg-card/95 backdrop-blur-xl border border-cyan-500/20 rounded-[24px] shadow-[0_20px_50px_rgba(6,182,212,0.15)] p-5 group relative overflow-hidden ring-1 ring-white/10 transition-all duration-300 ${onClick ? "cursor-pointer hover:scale-[1.02] hover:border-cyan-500/40 active:scale-[0.98]" : ""}`}
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-cyan-500/10 rounded-[18px] border border-cyan-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Megaphone className="w-5.5 h-5.5 text-cyan-500" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/20 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-none">
                Announcement
              </Badge>
              <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.15em] leading-none">
                System Update
              </span>
            </div>
            <h4 className="text-[15px] font-black text-foreground mt-0.5 max-w-[220px] truncate capitalize tracking-tight group-hover:text-cyan-600 transition-colors">
              {title || "New Announcement"}
            </h4>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(id);
          }}
          className="h-9 w-9 flex items-center justify-center hover:bg-muted rounded-full transition-all text-muted-foreground/30 hover:text-foreground active:scale-90"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      <div className="mt-4 relative z-10">
        <div className="text-[13px] text-foreground/70 font-medium leading-relaxed bg-muted/30 p-4 rounded-[18px] border border-border/40 shadow-inner group-hover:bg-muted/50 transition-colors">
          <p className="line-clamp-2">
            {description || "A new announcement has been posted."}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between relative z-10">
        <span className="text-[11px] font-bold text-muted-foreground/50">Click to view details</span>
        <div className="flex items-center gap-1.5 text-[12px] font-black text-cyan-600 group-hover:translate-x-1 transition-transform">
          Open Announcement
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
      
      {/* Active Indicator Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-cyan-500/20 w-full overflow-hidden">
        <div className="h-full bg-cyan-500 animate-[announcement-progress_6s_linear_forwards]" />
      </div>

      <style jsx>{`
        @keyframes announcement-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export const showAnnouncementNotice = (data: { title: string; description: string; onClick?: () => void; id?: string | number }) => {
  const toastId = data.id || `announcement-${Math.random().toString(36).substring(2, 9)}`;
  toast.custom((t) => (
    <AnnouncementNotificationToast 
      {...data} 
      id={toastId} 
    />
  ), {
    duration: 6000,
    position: "top-right",
    id: toastId,
  });
};
