"use client";

import React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BellRing, ShieldCheck } from "lucide-react";

interface NotificationModalProps {
  onEnable: () => void;
  loading?: boolean;
  isDenied?: boolean;
}

export default function NotificationModal({ 
  onEnable, 
  loading, 
  isDenied 
}: NotificationModalProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <DialogHeader>
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-primary/10 rounded-full">
            <BellRing className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <DialogTitle className="text-xl">
              {isDenied ? "Action Required" : "Enable Notifications"}
            </DialogTitle>
            <DialogDescription>
              {isDenied ? "Permissions are currently blocked" : "Stay updated with real-time alerts"}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-4">
        {isDenied ? (
          <div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/10 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold text-destructive">Notifications are blocked</p>
              <p className="text-muted-foreground leading-relaxed">
                You previously blocked notifications for this site. To receive alerts, please click the <strong>lock icon</strong> next to the URL in your browser's address bar and set Notifications to <strong>Allow</strong>.
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get instant updates about your <strong>students, batches, and tickets</strong>. 
              Notifications help you respond faster and stay organized.
            </p>
            
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-foreground">Secure & Private</p>
                <p className="text-muted-foreground">We only send important updates. You can turn this off anytime in Settings.</p>
              </div>
            </div>
          </>
        )}
      </div>

      <DialogFooter className="sm:justify-start gap-2">
        <Button 
          type="button" 
          onClick={onEnable} 
          disabled={loading}
          className="flex-1 sm:flex-none font-semibold px-8"
        >
          {loading ? "Registering..." : isDenied ? "Try anyway" : "Enable Now"}
        </Button>
      </DialogFooter>
    </div>
  );
}
