"use client";

import { useEffect, useState } from "react";
import { NotificationItem } from "@/features/notifications/model";
import notificationService from "@/features/notifications/api.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Calendar, Clock } from "lucide-react";
import { stripHtml, parseDate } from "@/lib/utils";
import { format } from "date-fns";

export default function AnnouncementDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<NotificationItem | null>(null);

  useEffect(() => {
    const handleNewAnnouncement = async (event: any) => {
      const announcement = event.detail as any;
      if (!announcement) return;

      console.log("Global Dialog: Full Announcement Data Received", announcement);
      console.log("Global Dialog: Attachment URL detected", announcement.attachment || announcement.image);
      setData(announcement);
      setIsOpen(true);
    };

    window.addEventListener("new-announcement", handleNewAnnouncement);
    return () => {
      window.removeEventListener("new-announcement", handleNewAnnouncement);
    };
  }, []);

  if (!data) return null;

  // Defensive date formatting
  let formattedDate = "Just now";
  let formattedTime = "";
  try {
    if (data.created_at) {
      const dateObj = parseDate(data.created_at);
      formattedDate = format(dateObj, "PPP");
      formattedTime = format(dateObj, "p");
    }
  } catch (e) {
    console.error("Date formatting error:", e);
  }

  const attachmentUrl = 
    data.attachment || 
    (data as any).image || 
    (data as any).data?.attachment || 
    (data as any).data?.image;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-3xl border-none shadow-2xl overflow-hidden max-w-[600px] p-0 z-[10000]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 z-50" />
        
        {attachmentUrl && (
          <div className="relative w-full aspect-video bg-zinc-100 overflow-hidden group">
            <img 
              src={attachmentUrl} 
              alt={data.title}
              onError={(e) => {
                console.error("Global Dialog: Image failed to load", attachmentUrl);
                (e.target as any).style.display = 'none';
              }}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-6 right-6 text-white pointer-events-none">
              <Badge className="bg-cyan-500 text-white border-none mb-2 shadow-lg">New Announcement</Badge>
              <h2 className="text-2xl font-bold line-clamp-2 drop-shadow-lg">
                {data.title}
              </h2>
            </div>
          </div>
        )}

        <div className="p-8 space-y-6 bg-background">
          <div className="space-y-2">
            {!attachmentUrl && (
              <div className="flex items-center gap-2 text-cyan-600 font-bold uppercase tracking-wider text-xs">
                <Megaphone className="h-4 w-4" />
                System Announcement
              </div>
            )}
            <DialogTitle className="text-3xl font-extrabold tracking-tight">
              {data.title}
            </DialogTitle>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-2xl">
            <div className="flex items-center gap-1.5 px-2 border-r border-border last:border-0 border-opacity-50">
              <Calendar className="h-4 w-4 text-cyan-500" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            {formattedTime && (
              <div className="flex items-center gap-1.5 px-2 border-r border-border last:border-0 border-opacity-50">
                <Clock className="h-4 w-4 text-cyan-500" />
                <span className="font-medium">{formattedTime}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-cyan-500/20 rounded-full" />
            <p className="text-base leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {stripHtml(data.description || "")}
            </p>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 pt-2">
          <Button 
            onClick={() => setIsOpen(false)} 
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold h-12 rounded-2xl shadow-xl shadow-cyan-600/20 transition-all active:scale-[0.98]"
          >
            Close Announcement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
