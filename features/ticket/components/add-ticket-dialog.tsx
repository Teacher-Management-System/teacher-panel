"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Plus, Ticket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddTicketDialogProps {
  onAddTicket: (ticket: { subject: string; message: string }) => Promise<void> | void;
}

export function AddTicketDialog({ onAddTicket }: AddTicketDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async () => {
    if (subject.trim() && message.trim()) {
      try {
        setLoading(true);
        await onAddTicket({ subject, message });
        setSubject("");
        setMessage("");
        setOpen(false);
      } catch (error) {
        // Error is handled by the parent component (toast)
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg md:rounded-[20px] bg-primary hover:bg-primary/90 h-10 md:h-14 px-3 md:px-8 shadow-lg shadow-primary/20 text-primary-foreground font-black flex items-center gap-1.5 md:gap-3 border-none transition-all active:scale-95 w-full">
          <Plus className="h-4 w-4 md:h-6 md:w-6 stroke-[3]" />
          <span className="text-[11px] md:text-[16px] tracking-tight uppercase tracking-wider">New Ticket</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-[32px] p-8 border border-border bg-card shadow-2xl">
        <DialogHeader className="flex flex-row items-center gap-5 space-y-0 text-left mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Ticket className="h-7 w-7 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-2xl font-black text-foreground tracking-tight">
              Create New Ticket
            </DialogTitle>
            <p className="text-[13px] font-medium text-muted-foreground/60">
              Fill in the details to open a support ticket
            </p>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-0">
          <div className="flex flex-col gap-3">
            <Label
              htmlFor="subject"
              className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1"
            >
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="What's the issue about?"
              className="h-14 rounded-[22px] border border-border bg-muted/50 px-6 text-[15px] font-medium placeholder:text-muted-foreground/40 focus-visible:ring-primary/20 transition-all shadow-none"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label
              htmlFor="message"
              className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1"
            >
              Description
            </Label>
            <Textarea
              id="message"
              placeholder="Describe your problem in detail..."
              className="min-h-[160px] rounded-[22px] border border-border bg-muted/50 p-6 text-[15px] font-medium placeholder:text-muted-foreground/40 focus-visible:ring-primary/20 transition-all resize-none shadow-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
            disabled={loading}
            className="h-14 rounded-[22px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[15px] shadow-lg shadow-primary/20 border-none transition-all active:scale-scale-95"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
            ) : (
              "Create Ticket"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
