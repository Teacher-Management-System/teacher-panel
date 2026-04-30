"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Copy, Download, QrCode, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import CompleteProfilePopup from "@/components/CompleteProfilePopup";
import { JoinNowPopup } from "@/components/JoinNowPopup";
import studentService from "@/features/students/api.service";

export function GenerateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
  const { user, isProfileCompleted, isDocumentCompleted } = useAuth();
  const [showJoinNowModal, setShowJoinNowModal] = useState(false);
  const [linkData, setLinkData] = useState<{ url: string; qr_image: string } | null>(null);
  const [isFetchingLink, setIsFetchingLink] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchFormUrl = async () => {
        setIsFetchingLink(true);
        try {
          const response: any = await studentService.getFormUrl();
          const data = response?.teacher_url;
          if (data) {
            setLinkData(data);
          }
        } catch (error) {
          console.error("Failed to fetch link data", error);
        } finally {
          setIsFetchingLink(false);
        }
      };
      fetchFormUrl();
    }
  }, [open]);

  const link = linkData?.url || "";
  const qrUrl = linkData?.qr_image || "";

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
  };

  const handleDownloadQR = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = qrUrl.split("/").pop() || "student-join-qr.png";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("QR Code downloaded successfully!");
    } catch (error) {
      console.error("Failed to download QR code", error);
      toast.error("Failed to download QR code. Please try again.");
    }
  };

  const handleGenerateLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user?.status === "pending") {
      setShowJoinNowModal(true);
      return;
    }

    if (!isProfileCompleted || !isDocumentCompleted) {
      setShowCompleteProfileModal(true);
      return;
    }

    setOpen(true);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleGenerateLinkClick}
        disabled={isLoading}
        className="border-primary/20 text-primary hover:bg-primary/10 flex items-center gap-2 rounded-xl h-10 md:h-11 shadow-sm transition-all w-full"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
        <span className="font-bold text-[13px] md:text-sm">
          Generate Student Link
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col items-center text-center relative bg-card">
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent -z-10" />

            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-inner">
              <QrCode className="w-8 h-8" />
            </div>

            <DialogHeader className="space-y-2 mb-8">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Student Join Link
              </DialogTitle>
              <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
                Share this QR code or link with your students to let them join your batch.
              </p>
            </DialogHeader>

            {isFetchingLink ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground font-medium">Generating your link...</p>
              </div>
            ) : (
              <>
                {/* QR Code Display */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-border/50 mb-6 flex justify-center items-center">
                  {qrUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={qrUrl}
                      alt="QR Code"
                      className="w-[180px] h-[180px] object-contain"
                    />
                  ) : (
                    <div className="w-[180px] h-[180px] flex items-center justify-center bg-muted/50 rounded-xl text-muted-foreground text-xs font-medium">
                      No QR Code Available
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleDownloadQR}
                  disabled={!qrUrl}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white rounded-xl mb-6 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] h-11"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="font-bold">Download QR Code</span>
                </Button>

                {/* Link Section */}
                <div className="w-full space-y-2 text-left">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                    Shareable Link
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={link}
                      className="bg-muted/50 border-none h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/30 font-medium text-foreground"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={handleCopy}
                      disabled={!link}
                      className="h-11 w-11 rounded-xl shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CompleteProfilePopup
        open={showCompleteProfileModal}
        onOpenChange={setShowCompleteProfileModal}
      />
      <JoinNowPopup
        externalOpen={showJoinNowModal}
        onOpenChange={setShowJoinNowModal}
      />
    </>
  );
}
