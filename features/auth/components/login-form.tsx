"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginSchema } from "../schema";
import authService from "../api.service";
import { cookieService } from "@/lib/cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Loader2,
  GraduationCap,
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import z from "zod";
import NextImage from "next/image";

type LoginFormValues = z.infer<typeof LoginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        console.log(response.auth_token);
        cookieService.setCookie("user", JSON.stringify(response?.user));
        cookieService.setCookie("authToken", response.auth_token);
        const redirect = cookieService.getCookie("redirect");
        if (redirect) {
          cookieService.deleteCookie("redirect");
          router.push(redirect);
        } else {
          router.push("/dashboard");
        }
      })
      .finally(() => {
        setLoading(false);
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
      <div className="flex-1 flex items-center justify-center p-8 relative z-10 bg-white">
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <NextImage
                src="/logo-icon.png"
                alt="Aerophantom Logo"
                width={300}
                height={300}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">
              Aerophantom
            </span>
          </Link>

          {/* Header */}
          <div
            className="mb-10 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Welcome Back</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">
              Sign In
            </h1>
            <p className="text-muted-foreground text-lg">
              Access your student management panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div
              className="space-y-2 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-12 h-14 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                  disabled={loading}
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div
              className="space-y-2 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-14 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                  disabled={loading}
                  {...form.register("password")}
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 rounded-xl text-base font-semibold animate-fade-in shadow-lg hover:shadow-primary/25 bg-primary hover:bg-primary/90 text-white"
              style={{ animationDelay: "0.4s" }}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p
            className="mt-8 text-center text-muted-foreground animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-bold hover:text-primary/80 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
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
