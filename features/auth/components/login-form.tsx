"use client";
import React, { Suspense } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "../schema";
import authService from "../api.service";
import { cookieService } from "@/lib/cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import profileService from "@/features/profile/aou.service";
import { toast } from "sonner";
import {
  Loader2,
  GraduationCap,
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  BarChart3,
  Zap,
} from "lucide-react";
import Link from "next/link";
import z from "zod";
import NextImage from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type LoginFormValues = z.infer<typeof LoginSchema>;

function LoginFormContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setLoading(true);
      cookieService.deleteCookie("authToken");
      cookieService.deleteCookie("user");
      cookieService.setCookie("authToken", token);

      profileService
        .getProfile()
        .then((response: any) => {
          const userData = response?.user || response;
          if (userData) {
            cookieService.setCookie("user", JSON.stringify(userData));
            window.location.replace("/dashboard");
          } else {
            throw new Error("Invalid profile response");
          }
        })
        .catch((error) => {
          console.error("Auto-login error:", error);
          cookieService.deleteCookie("authToken");
          setLoading(false);
          toast.error("Auto-login failed or token expired.");
        });
    }
  }, [searchParams]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setLoading(true);
    authService
      .login({ ...values, email: values.email.toLowerCase() })
      .then((response: any) => {
        cookieService.setCookie("user", JSON.stringify(response?.user));
        cookieService.setCookie("authToken", response.auth_token);

        const redirectParam = searchParams.get("redirect");
        const redirectCookie = cookieService.getCookie("redirect");
        const redirect = redirectParam || redirectCookie;

        if (redirect) {
          cookieService.deleteCookie("redirect");
          window.location.href = redirect;
        } else {
          window.location.href = "/dashboard";
        }
      })
      .catch((error: any) => {
        console.error("Login Error:", error);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden w-full bg-white">

      {/* ─── LEFT SIDE — FORM ─── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative z-10 bg-white">
        {/* Back to Home */}
        <Link
          href="/"
          className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 text-slate-400 hover:text-[#1fc0c7] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Home</span>
        </Link>

        <div className="w-full max-w-[460px] animate-slide-up flex flex-col items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 group justify-center">
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
          <div className="mb-8 animate-fade-in flex flex-col items-center text-center w-full" style={{ animationDelay: "0.1s" }}>
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5"
              style={{ background: "linear-gradient(135deg, rgba(31,192,199,0.12), rgba(8,145,178,0.08))", border: "1px solid rgba(31,192,199,0.2)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1fc0c7]" />
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#1fc0c7]">
                Welcome Back
              </span>
            </div>
            <h1 className="text-[38px] leading-[1.1] font-extrabold text-slate-900 mb-3 tracking-tight">
              Sign In
            </h1>
            <p className="text-slate-500 text-[15px] font-medium">
              Access your student management panel
            </p>
          </div>

          {/* Form */}
          <div className="w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                      <FormLabel className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] pl-1">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 group-focus-within:text-[#1fc0c7] transition-colors z-10" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-[50px] h-[54px] bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-[#1fc0c7]/30 focus-visible:border-[#1fc0c7] transition-all font-semibold text-slate-700 text-[15px] placeholder:text-slate-300 hover:border-slate-200"
                            disabled={loading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                      <div className="flex justify-between items-center px-1">
                        <FormLabel className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em]">
                          Password
                        </FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="text-[12px] text-[#1fc0c7] hover:text-[#0891b2] transition-colors font-extrabold tracking-wide"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 group-focus-within:text-[#1fc0c7] transition-colors z-10" />
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-[54px] text-white rounded-2xl text-[15px] font-extrabold shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(31,192,199,0.35)] hover:-translate-y-0.5 active:translate-y-0 animate-fade-in mt-4 border-0"
                  style={{
                    background: "linear-gradient(135deg, #1fc0c7 0%, #0891b2 100%)",
                    animationDelay: "0.4s",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      Sign In
                      <ArrowRight className="w-[18px] h-[18px] mt-[1px]" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Sign Up Link */}
            <p
              className="mt-8 text-center text-slate-400 font-semibold text-[15px] animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-[#1fc0c7] font-extrabold hover:text-[#0891b2] transition-colors ml-1"
              >
                Sign up for free
              </Link>
            </p>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 mt-5 text-slate-300 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">256-bit SSL encrypted · Secure login</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT SIDE — DECORATIVE ─── */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1fc0c7 0%, #0e9aa7 40%, #0891b2 100%)" }}
      >
        {/* Decorative Circles */}
        <div className="absolute top-16 right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-24 left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Floating dots */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              top: `${20 + i * 15}%`,
              right: `${10 + i * 8}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${3 + i * 0.4}s`,
            }}
          />
        ))}

        <div className="text-center text-white relative z-10 max-w-md">
          {/* Logo */}
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8 animate-bounce-in bg-white/15 rounded-3xl backdrop-blur-sm border border-white/20 p-4">
            <NextImage
              src="/logo-icon.png"
              alt="Aerophantom Logo"
              width={300}
              height={300}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>

          <h2 className="text-[40px] font-extrabold mb-5 animate-slide-up tracking-tight leading-tight">
            Manage Students
            <br />
            <span className="text-white/80">With Confidence</span>
          </h2>

          <p className="text-white/75 text-lg animate-fade-in leading-relaxed mb-10" style={{ animationDelay: "0.3s" }}>
            Track enrollments, manage payments, and grow your coaching business with our intuitive panel.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { icon: Users, value: "2,500+", label: "Educators" },
              { icon: BarChart3, value: "50K+", label: "Students" },
              { icon: Zap, value: "99.9%", label: "Uptime" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl backdrop-blur-sm border border-white/15 hover:bg-white/15 transition-all cursor-default"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <stat.icon className="w-5 h-5 text-white/70 mx-auto mb-2" />
                <div className="text-xl font-extrabold text-white">{stat.value}</div>
                <div className="text-xs text-white/60 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {["✓ Easy Setup", "✓ Secure", "✓ 24/7 Support"].map((pill) => (
              <span
                key={pill}
                className="px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/15 hover:bg-white/20 transition-colors cursor-default"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginForm(props: React.ComponentProps<"div">) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent {...props} />
    </Suspense>
  );
}
