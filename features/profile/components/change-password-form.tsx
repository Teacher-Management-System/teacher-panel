"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, ShieldCheck, Key, Sparkles } from "lucide-react";
import { toast } from "sonner";
import profileService from "../aou.service";
import { useModal } from "@/hooks/use-modal";

const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Old password is required"),
    password: z.string().min(8, "New password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModal();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        old_password: data.old_password,
        password: data.password,
      };
      await profileService.changePassword(payload);
      closeModal();
    } catch (error: any) {
      console.error("Change password failed:", error);
      toast.error(
        error?.response?.data?.message || "Failed to change password",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 min-w-[56px] h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
            <Lock className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground tracking-tight leading-none mb-1">
              Security
            </h3>
            <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
              Update Password
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] ml-1">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative group transition-all">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-background border border-border/50 flex items-center justify-center text-muted-foreground/40 group-focus-within:text-primary group-focus-within:border-primary/30 transition-all">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-14 h-12 bg-muted/30 border-border rounded-2xl focus-visible:ring-primary/10 transition-all font-medium"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] ml-1">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative group transition-all">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-background border border-border/50 flex items-center justify-center text-muted-foreground/40 group-focus-within:text-primary group-focus-within:border-primary/30 transition-all">
                        <Key className="w-4 h-4" />
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-14 h-12 bg-muted/30 border-border rounded-2xl focus-visible:ring-primary/10 transition-all font-medium"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] ml-1">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative group transition-all">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-background border border-border/50 flex items-center justify-center text-muted-foreground/40 group-focus-within:text-primary group-focus-within:border-primary/30 transition-all">
                        <Key className="w-4 h-4" />
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-14 h-12 bg-muted/30 border-border rounded-2xl focus-visible:ring-primary/10 transition-all font-medium"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 rounded-[20px] bg-slate-950 hover:bg-slate-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-white font-bold text-base shadow-xl hover:-translate-y-0.5 transition-all gap-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                Update Password
              </>
            )}
          </Button>

          {/* Security Footer Info */}
          <div className="mt-8 p-4 bg-muted/30 rounded-3xl border border-border/50 flex items-start gap-4">
            <div className="w-10 min-w-[40px] h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-orange-500 shadow-sm">
              <Sparkles className="w-5 h-5 fill-orange-500/10" strokeWidth={2.5} />
            </div>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
              Make sure your new password is at least 8 characters long and
              includes a mix of letters, numbers, and symbols for maximum
              security.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
