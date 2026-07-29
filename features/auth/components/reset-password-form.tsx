"use client";
import React, { Suspense } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import authService from "../api.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Loader2,
  LockKeyhole,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { ResetPasswordSchema } from "../schema";
import { z } from "zod";
import Link from "next/link";
import NextImage from "next/image";
import { toast } from "sonner";

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

function ResetPasswordFormContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const maskedEmail = email ? email.replace(/(.{3})(.*)(@.*)/, "$1•••$3") : "";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: token || "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    setLoading(true);
    authService
      .resetPassword({
        password: values.password,
        token: values.token,
      })
      .then(() => {
        toast.success("Password reset successfully!");
        router.push("/auth/login");
      })
      .catch((error: any) => {
        console.error(error.response?.data?.message || "Failed to reset password");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden w-full bg-white">

      {/* ─── LEFT SIDE — FORM ─── */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 relative z-10 bg-white">
        {/* Back to Login */}
        <Link
          href="/auth/login"
          className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 text-slate-400 hover:text-[#1fc0c7] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Login</span>
        </Link>

        <div className="w-full max-w-[440px] mx-auto animate-slide-up flex flex-col items-start">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden border border-slate-100 shadow-sm group-hover:scale-110 transition-transform duration-300 bg-white">
              <NextImage
                src="/logo-icon.png"
                alt="Aerophantom Logo"
                width={300}
                height={300}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <span className="font-extrabold text-[22px] text-slate-900 tracking-tight">
              Aerophantom
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8 flex flex-col items-start">
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5"
              style={{ background: "linear-gradient(135deg, rgba(31,192,199,0.1), rgba(8,145,178,0.06))", border: "1px solid rgba(31,192,199,0.2)" }}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#1fc0c7]" />
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#1fc0c7]">
                Set New Password
              </span>
            </div>

            <h1 className="text-[36px] leading-[1.1] font-extrabold text-slate-900 mb-3 tracking-tight">
              Reset Password
            </h1>

            {maskedEmail ? (
              <p className="text-slate-500 text-[15px] font-medium leading-relaxed">
                Setting new password for{" "}
                <span className="font-extrabold text-slate-700">{maskedEmail}</span>
              </p>
            ) : (
              <p className="text-slate-500 text-[15px] font-medium leading-relaxed">
                Create a strong new password for your account
              </p>
            )}
          </div>

          {/* Invalid token warning */}
          {!token && (
            <div className="w-full p-4 mb-6 rounded-2xl border border-red-100 bg-red-50 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-red-600 text-sm font-semibold">
                Invalid or missing reset token. Please request a new one.
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
              {/* New Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    <FormLabel className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] pl-1">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 group-focus-within:text-[#1fc0c7] transition-colors z-10" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-[50px] pr-12 h-[54px] bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-[#1fc0c7]/30 focus-visible:border-[#1fc0c7] transition-all font-bold text-slate-700 text-[18px] pb-1 tracking-[0.2em] placeholder:tracking-normal placeholder:text-slate-300 hover:border-slate-200"
                          disabled={loading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#1fc0c7] transition-colors z-10"
                        >
                          {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <FormLabel className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] pl-1">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 group-focus-within:text-[#1fc0c7] transition-colors z-10" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-[50px] pr-12 h-[54px] bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-[#1fc0c7]/30 focus-visible:border-[#1fc0c7] transition-all font-bold text-slate-700 text-[18px] pb-1 tracking-[0.2em] placeholder:tracking-normal placeholder:text-slate-300 hover:border-slate-200"
                          disabled={loading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#1fc0c7] transition-colors z-10"
                        >
                          {showConfirmPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-[54px] text-white rounded-2xl text-[15px] font-extrabold shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(31,192,199,0.35)] hover:-translate-y-0.5 active:translate-y-0 border-0 mt-2"
                style={{ background: "linear-gradient(135deg, #1fc0c7 0%, #0891b2 100%)" }}
                disabled={loading || !token}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating Password...
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    Reset Password
                    <ArrowRight className="w-[18px] h-[18px] mt-[1px]" />
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-slate-400 font-semibold text-[14px] w-full">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-[#1fc0c7] font-extrabold hover:text-[#0891b2] transition-colors ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ─── RIGHT SIDE — DECORATIVE ─── */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1fc0c7 0%, #0e9aa7 40%, #0891b2 100%)" }}
      >
        {/* Blobs */}
        <div className="absolute top-16 right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-24 left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Dots */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/25 rounded-full animate-float"
            style={{
              top: `${20 + i * 14}%`,
              right: `${10 + i * 7}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${3 + i * 0.4}s`,
            }}
          />
        ))}

        <div className="text-center text-white relative z-10 max-w-md flex flex-col items-center">
          <div className="w-28 h-28 flex items-center justify-center mx-auto mb-10 animate-bounce-in bg-white/15 rounded-3xl backdrop-blur-sm border border-white/20">
            <KeyRound className="h-14 w-14 text-white drop-shadow-lg" />
          </div>

          <h2 className="text-[40px] font-extrabold mb-5 animate-slide-up tracking-tight leading-tight">
            Almost There!
            <br />
            <span className="text-white/80">New Password</span>
          </h2>

          <p className="text-white/75 text-lg animate-fade-in leading-relaxed mb-10 max-w-sm" style={{ animationDelay: "0.3s" }}>
            Create a strong, unique password to protect your account and keep your students&apos; data safe.
          </p>

          {/* Tips */}
          <div className="space-y-3 text-left w-full animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {[
              "At least 8 characters long",
              "Mix of uppercase & lowercase letters",
              "Include numbers and symbols",
            ].map((tip, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-white/15"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  {i + 1}
                </div>
                <span className="text-white/80 text-sm font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordForm(props: React.ComponentProps<"div">) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormContent {...props} />
    </Suspense>
  );
}
