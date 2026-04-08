"use client";

import React from "react";
import { Ticket, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReopenTicketDialogProps {
  onReopenTicket: (description: string) => Promise<void> | void;
  className?: string;
}

export function ReopenTicketDialog({ onReopenTicket, className }: ReopenTicketDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async () => {
    if (description.trim()) {
      try {
        setLoading(true);
        await onReopenTicket(description);
        setDescription("");
        setOpen(false);
      } catch (error) {
        // Error is handled by parent
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className || "mt-4 rounded-xl bg-primary hover:bg-primary/90 h-11 px-6 shadow-lg shadow-primary/20 text-primary-foreground font-black flex items-center gap-2 border-none transition-all active:scale-95"}>
          <RotateCcw className="h-4 w-4 stroke-[3]" />
          <span className="text-[13px] tracking-tight uppercase tracking-wider">Reopen Ticket</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-[32px] p-8 border border-border bg-card shadow-2xl">
        <DialogHeader className="flex flex-row items-center gap-5 space-y-0 text-left mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <RotateCcw className="h-7 w-7 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-2xl font-black text-foreground tracking-tight">
              Reopen Ticket
            </DialogTitle>
            <p className="text-[13px] font-medium text-muted-foreground/60">
              Provide a reason for reopening this ticket
            </p>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-0">
          <div className="flex flex-col gap-3">
            <Label
              htmlFor="description"
              className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1"
            >
              Description / Reason
            </Label>
            <Textarea
              id="description"
              placeholder="Why are you reopening this ticket?"
              className="min-h-[160px] rounded-[22px] border border-border bg-muted/50 p-6 text-[15px] font-medium placeholder:text-muted-foreground/40 focus-visible:ring-primary/20 transition-all resize-none shadow-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-4 mt-10">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="h-14 rounded-[22px] bg-muted/50 hover:bg-muted text-muted-foreground font-bold text-[15px] border-none transition-all active:scale-95"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={loading || !description.trim()}
            className="h-14 rounded-[22px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[15px] shadow-lg shadow-primary/20 border-none transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
