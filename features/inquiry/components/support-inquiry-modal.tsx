"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Headset, Loader2, Sparkles, MessageSquare } from "lucide-react";
import inquiryService from "../api.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const supportInquirySchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type SupportInquiryValues = z.infer<typeof supportInquirySchema>;

interface SupportInquiryModalProps {
  user: any;
  onConfirm?: () => void;
}

export default function SupportInquiryModal({ user, onConfirm }: SupportInquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SupportInquiryValues>({
    resolver: zodResolver(supportInquirySchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: SupportInquiryValues) => {
    setIsSubmitting(true);
    try {
      await inquiryService.paymentInquiry({
        message: values.message,
      });
      if (onConfirm) onConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <DialogHeader>
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-primary/10 rounded-full">
            <Headset className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Contact Support <Sparkles className="w-4 h-4 text-yellow-500" />
            </DialogTitle>
            <DialogDescription>
              We're here to help you get started
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  How can we help you?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us what you need help with..."
                    className="min-h-[150px] rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-primary focus:border-primary transition-all resize-none p-4"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Inquiry...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Message
                </>
              )}
            </Button>
            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Typical response time: 2-4 hours
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
