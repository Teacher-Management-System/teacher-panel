"use client";
import React, { Suspense } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginSchema } from "../schema";
import authService from "../api.service";
import { cookieService } from "@/lib/cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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
      .login(values)
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
      })
      .finally(() => {
        // setLoading(false); // Move to finally if we want it to run always, but catch handles it now
      });
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden w-full bg-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 bg-white">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-[14px]">Back to Home</span>
        </Link>

        <div className="w-full max-w-[500px] animate-slide-up flex flex-col items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 mb-12 group justify-center"
          >
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden">
              <NextImage
                src="/logo-icon.png"
                alt="Aerophantom Logo"
                width={300}
                height={300}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <span className="font-extrabold text-[22px] text-[#0f172a] tracking-tight">
              Aerophantom
            </span>
          </Link>

          {/* Header */}
          <div
            className="mb-10 animate-fade-in flex flex-col items-center text-center w-full"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold tracking-widest uppercase mt-0.5">
                Welcome Back
              </span>
            </div>
            <h1 className="text-[38px] leading-[1.1] font-extrabold text-[#0f172a] mb-3 tracking-tight">
              Sign In
            </h1>
            <p className="text-muted-foreground text-[16px] font-medium">
              Access your student management panel
            </p>
          </div>

          {/* Form */}
          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem
                      className="space-y-1.5 animate-fade-in"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <FormLabel className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] pl-1">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-[52px] h-[56px] bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-semibold text-slate-700 text-[15px]"
                            disabled={loading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem
                      className="space-y-1.5 animate-fade-in"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <div className="flex justify-between items-center px-1">
                        <FormLabel className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-[0.15em]">
                          Password
                        </FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="text-[12px] text-primary hover:text-primary/80 transition-colors font-extrabold tracking-wide"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-[52px] pr-12 h-[56px] bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-bold text-slate-700 text-[18px] pb-1 tracking-[0.2em]"
                            disabled={loading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors z-10"
                          >
                            {showPassword ? (
                              <EyeOff className="w-[18px] h-[18px]" />
                            ) : (
                              <Eye className="w-[18px] h-[18px]" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-[56px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-[16px] font-extrabold shadow-lg hover:shadow-primary/25 transition-all animate-fade-in mt-4"
                  style={{ animationDelay: "0.4s" }}
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
              className="mt-8 text-center text-muted-foreground font-semibold text-[15px] animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary font-extrabold hover:text-primary/80 transition-colors ml-1"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-32 left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        <div className="text-center text-primary-foreground relative z-10">
          <div className="w-28 h-28 flex items-center justify-center mx-auto mb-10 animate-bounce-in">
            <NextImage
              src="/logo-icon.png"
              alt="Aerophantom Logo"
              width={300}
              height={300}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
          <h2 className="font-display text-4xl font-bold mb-6 animate-slide-up tracking-tight">
            Manage Students
            <br />
            <span className="text-white/90">With Confidence</span>
          </h2>
          <p
            className="text-primary-foreground/90 max-w-md text-lg animate-fade-in mx-auto leading-relaxed"
            style={{ animationDelay: "0.3s" }}
          >
            Track enrollments, manage payments, and grow your coaching business
            with our intuitive panel.
          </p>

          {/* Feature Pills */}
          <div
            className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="px-5 py-2.5 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/10 shadow-sm hover:bg-white/30 transition-colors cursor-default">
              ✓ Easy Setup
            </span>
            <span className="px-5 py-2.5 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/10 shadow-sm hover:bg-white/30 transition-colors cursor-default">
              ✓ Secure
            </span>
            <span className="px-5 py-2.5 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/10 shadow-sm hover:bg-white/30 transition-colors cursor-default">
              ✓ 24/7 Support
            </span>
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
