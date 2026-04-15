"use client";

import React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BellRing, ShieldCheck } from "lucide-react";

interface NotificationModalProps {
  onEnable: () => void;
  loading?: boolean;
}

export default function NotificationModal({ onEnable, loading }: NotificationModalProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <DialogHeader>
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-primary/10 rounded-full">
            <BellRing className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <DialogTitle className="text-xl">Enable Notifications</DialogTitle>
            <DialogDescription>Stay updated with real-time alerts</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-4">
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
      </div>

      <DialogFooter className="sm:justify-start gap-2">
        <Button 
          type="button" 
          onClick={onEnable} 
          disabled={loading}
          className="flex-1 sm:flex-none font-semibold px-8"
        >
          {loading ? "Registering..." : "Enable Now"}
        </Button>
      </DialogFooter>
    </div>
  );
}
