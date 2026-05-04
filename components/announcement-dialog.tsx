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
import { cookieService } from "@/lib/cookie";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { stripHtml, parseDate } from "@/lib/utils";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useAuth } from "@/hooks/useAuth";

export default function AnnouncementDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<NotificationItem | null>(null);
  const { isActive, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !isActive) return;

    // Check for unread announcements on load/login
    const checkUnreadAnnouncements = async () => {
      const authToken = cookieService.getCookie("authToken");
      if (!authToken) return;

      try {
        const response = await notificationService.getNotifications({
          status: "unacknowledged",
        });
        if (response?.notifications && response.notifications.length > 0) {
          setData(response.notifications[0]);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed to fetch unread announcements on load:", error);
      }
    };

    // Delay slightly to ensure smooth initial page load
    const timeout = setTimeout(checkUnreadAnnouncements, 1500);

    const handleNewAnnouncement = async (event: any) => {
      // Small defensive check even though effect is restricted
      if (!isActive) return;

      const announcement = event.detail as any;
      if (!announcement) return;

      console.log(
        "Global Dialog: Full Announcement Data Received",
        announcement,
      );
      console.log(
        "Global Dialog: Attachment URL detected",
        announcement.attachment || announcement.image,
      );
      setData(announcement);
      setIsOpen(true);
    };

    window.addEventListener("new-announcement", handleNewAnnouncement);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("new-announcement", handleNewAnnouncement);
    };
  }, [isActive, isLoading]);

  if (!data) return null;

  // Defensive date formatting
  let formattedDate = "Just now";
  let formattedTime = "";
  try {
    const displayDate =
      data.send_at ||
      (data as any).sendAt ||
      data.scheduled_at ||
      (data as any).data?.send_at ||
      (data as any).data?.scheduled_at ||
      (data as any).data?.created_at ||
      data.created_at;

    console.log("displayDate chosen:", displayDate);

    if (displayDate) {
      const dateObj = parseDate(displayDate);
      formattedDate = format(dateObj, "MMMM dd, yyyy");
      formattedTime = format(dateObj, "hh:mm aa");
    }
  } catch (e) {
    console.error("Date formatting error:", e);
  }

  // Format attachment URL with base URL if needed
  const getAttachments = () => {
    if (!data) return [];

    // Prioritize plural attachments array if it exists
    let attachments: any =
      data.attachments ||
      data.attachment ||
      (data as any).image ||
      (data as any).data?.attachments ||
      (data as any).data?.attachment ||
      (data as any).data?.image;

    if (!attachments) return [];

    let attachmentsArray: string[] = [];

    if (Array.isArray(attachments)) {
      attachmentsArray = attachments;
    } else if (typeof attachments === "string") {
      // Handle comma separated or single string
      if (attachments.includes(",") && !attachments.startsWith("data:")) {
        attachmentsArray = attachments
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (attachments.startsWith("[") && attachments.endsWith("]")) {
        // Try to parse if it looks like a JSON array string
        try {
          const parsed = JSON.parse(attachments);
          attachmentsArray = Array.isArray(parsed) ? parsed : [attachments];
        } catch (e) {
          attachmentsArray = [attachments];
        }
      } else {
        attachmentsArray = [attachments];
      }
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

    return attachmentsArray
      .map((url) => {
        if (typeof url !== "string") return "";
        if (url.startsWith("http") || url.startsWith("data:")) return url;
        // Ensure we don't have multiple slashes if baseUrl ends with / or url starts with /
        const cleanBaseUrl = baseUrl.replace(/\/$/, "");
        const cleanUrl = url.replace(/^\//, "");
        return `${cleanBaseUrl}/${cleanUrl}`;
      })
      .filter((url) => url !== "");
  };

  const attachments = getAttachments();

  const handleClose = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-3xl border-none shadow-2xl overflow-hidden max-w-[600px] w-[95vw] max-h-[90vh] flex flex-col p-0 z-[10000]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 z-50 flex-shrink-0" />

        <div className="flex-1 overflow-y-auto scrollbar-hide pt-1.5 flex flex-col overflow-x-hidden">
          {attachments.length > 0 && (
            <div className="relative w-full aspect-video bg-zinc-100 overflow-hidden group flex-shrink-0 border-b border-border/5">
              {attachments.length === 1 ? (
                <img
                  src={attachments[0]}
                  alt={data.title}
                  onError={(e) => {
                    console.error(
                      "Global Dialog: Image failed to load",
                      attachments[0],
                    );
                    (e.target as any).style.display = "none";
                  }}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <Carousel className="w-full h-full">
                  <CarouselContent className="h-full ml-0">
                    {attachments.map((url, index) => (
                      <CarouselItem key={index} className="pl-0 h-full">
                        <img
                          src={url}
                          alt={`${data.title} - ${index + 1}`}
                          onError={(e) => {
                            console.error(
                              `Global Dialog: Carousel image ${index} failed to load`,
                              url,
                            );
                            (e.target as any).style.display = "none";
                          }}
                          className="w-full h-full object-contain"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <CarouselPrevious className="relative left-0 translate-x-0 pointer-events-auto bg-black/20 hover:bg-black/40 border-none text-white h-10 w-10" />
                    <CarouselNext className="relative right-0 translate-x-0 pointer-events-auto bg-black/20 hover:bg-black/40 border-none text-white h-10 w-10" />
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
                    {attachments.map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white/50"
                      />
                    ))}
                  </div>
                </Carousel>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6 right-6 text-white pointer-events-none">
                <Badge className="bg-cyan-500 text-white border-none mb-2 shadow-lg">
                  New Announcement
                </Badge>
                <h2 className="text-2xl font-bold line-clamp-2 drop-shadow-lg break-words">
                  {data.title}
                </h2>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-6 bg-background flex-shrink-0">
            <div className="space-y-2">
              {attachments.length === 0 && (
                <div className="flex items-center gap-2 text-cyan-600 font-bold uppercase tracking-wider text-xs">
                  <Megaphone className="h-4 w-4" />
                  System Announcement
                </div>
              )}
              <DialogTitle className="text-2xl md:text-3xl font-extrabold tracking-tight break-words line-clamp-3 overflow-hidden">
                {data.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {data.description || "System Announcement"}
              </DialogDescription>
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
              <p className="text-base leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap break-words">
                {stripHtml(data.description || "")}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 md:px-8 pb-6 md:pb-8 pt-4 flex-shrink-0 bg-background border-t border-border/5">
          <Button
            onClick={() => {
              const currentData = data;
              handleClose(false);
              setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent("new-announcement", { detail: currentData }),
                );
              }, 50);
            }}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold h-12 rounded-2xl shadow-xl shadow-cyan-600/20 transition-all active:scale-[0.98]"
          >
            Open
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
