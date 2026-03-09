"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
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
  onAddTicket: (ticket: { subject: string; message: string }) => void;
}

export function AddTicketDialog({ onAddTicket }: AddTicketDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  const onSubmit = () => {
    if (subject && message) {
      onAddTicket({ subject, message });
      setSubject("");
      setMessage("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 h-9 w-9 shadow-lg shadow-indigo-200"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Create New Ticket
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label
              htmlFor="subject"
              className="text-sm font-semibold text-slate-700"
            >
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="What's the issue about?"
              className="rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-indigo-100"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="message"
              className="text-sm font-semibold text-slate-700"
            >
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Describe your problem in detail..."
              className="min-h-[120px] rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-indigo-100 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="rounded-xl font-medium text-slate-500"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 font-semibold"
          >
            Create Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
