"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { JoinNowPopup } from "@/components/JoinNowPopup";
import { toast } from "sonner";

interface ExportButtonProps {
  onExport: () => Promise<any>;
  title?: string;
  className?: string;
}

export function ExportButton({
  onExport,
  title = "Export",
  className,
}: ExportButtonProps) {
  const { status } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showJoinNow, setShowJoinNow] = useState(false);

  const handleClick = async () => {
    if (status === "pending") {
      setShowJoinNow(true);
      return;
    }

    setIsLoading(true);
    try {
      const response: any = await onExport();

      // Handle Blob response (for CSV/Excel downloads)
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        const filename = `${title.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success(`${title} downloaded successfully`);
      }
      // Handle URL response (fallback)
      else if (response?.url) {
        window.open(response.url, "_blank");
      } else if (response?.download_url) {
        window.open(response.download_url, "_blank");
      } else {
        toast.success(`${title} processed successfully`);
      }
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error(error.message || `Failed to export ${title}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {title}
      </Button>

      <JoinNowPopup externalOpen={showJoinNow} onOpenChange={setShowJoinNow} />
    </>
  );
}
