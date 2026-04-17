"use client";

import { MessageSquare, Ticket as TicketIcon, X } from "lucide-react";
import { toast } from "sonner";

interface TicketNotificationToastProps {
  id: string | number;
  ticketNumber: string;
  subject: string;
  message: string;
  type?: "creation" | "status_update" | "message";
  onClick?: () => void;
}

export function TicketNotificationToast({
  id,
  ticketNumber,
  subject,
  message,
  type = "message",
  onClick,
}: TicketNotificationToastProps) {
  // Ensure ticketNumber is just the ID if provided with prefix
  const displayId = ticketNumber ? String(ticketNumber).replace(/^T-/, "") : "NEW";

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`flex flex-col w-full max-w-[380px] bg-card/95 backdrop-blur-xl border border-primary/20 rounded-[22px] shadow-[0_20px_50px_rgba(31,192,199,0.15)] p-4 group relative overflow-hidden ring-1 ring-white/10 transition-all duration-300 ${onClick ? "cursor-pointer hover:scale-[1.02] hover:border-primary/40 active:scale-[0.98]" : ""}`}
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-[16px] border border-primary/20 shadow-inner">
            {type === "message" ? (
              <MessageSquare className="w-5 h-5 text-primary" />
            ) : (
              <TicketIcon className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 shadow-sm leading-none">
                T-{displayId}
              </span>
              <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.15em] leading-none">
                {type === "creation" ? "Created" : type === "status_update" ? "Status Sync" : "New Reply"}
              </span>
            </div>
            <h4 className="text-[14px] font-black text-foreground mt-0.5 max-w-[200px] truncate capitalize tracking-tight">
              {subject || "Support Inquiry"}
            </h4>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(id);
          }}
          className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-full transition-all text-muted-foreground/40 hover:text-foreground active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 relative z-10 pl-1">
        <div className="text-[13px] text-foreground/70 font-medium leading-relaxed bg-muted/40 p-3 rounded-[16px] border border-border/40 shadow-inner">
          <p className="line-clamp-2">
            {message || "No content provided."}
          </p>
        </div>
      </div>
      
      {/* Active Indicator Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-primary/30 w-full overflow-hidden">
        <div className="h-full bg-primary animate-[progress_5s_linear_forwards]" />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

/**
 * Utility to trigger the premium ticket notification.
 */
export const showTicketNotice = (data: Omit<TicketNotificationToastProps, "id"> & { id?: string | number }) => {
  const toastId = data.id || Math.random().toString(36).substring(2, 9);
  toast.custom((t) => (
    <TicketNotificationToast 
      {...data} 
      id={toastId} 
    />
  ), {
    duration: 5000,
    position: "top-right",
    id: toastId,
  });
};
