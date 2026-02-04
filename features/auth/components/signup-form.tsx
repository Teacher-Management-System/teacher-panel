"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import NextImage from "next/image";
import authService from "../api.service";
import { cookieService } from "@/lib/cookie";

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    country_code: "+91",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const response: any = await authService.register(formData);

      if (response?.user) {
        cookieService.setCookie("user", JSON.stringify(response.user));
      }

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "Unlimited Student Records",
    "Payment Tracking",
    "Secure Dashboard",
    "24/7 Support",
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float" />
        <div
          className="absolute bottom-32 right-20 w-24 h-24 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 left-10 w-16 h-16 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        <div className="text-center text-primary-foreground relative z-10 max-w-lg">
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
            Start Managing
            <br />
            <span className="text-white/90">Students Today</span>
          </h2>
          <p
            className="text-primary-foreground/90 max-w-md mx-auto text-lg mb-10 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            Create your account and get access to the complete student
            management panel after payment verification.
          </p>

          {/* Features */}
          <div
            className="space-y-4 text-left animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20 hover:translate-x-2 border border-white/10"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10 bg-white">
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-15 h-15 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
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
            className="mb-8 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Get Started Free</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">
              Create Account
            </h1>
            <p className="text-muted-foreground text-lg">
              Fill in your details to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div
              className="space-y-2 animate-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-12 h-14 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="space-y-2 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-12 h-14 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div
                className="space-y-2 animate-fade-in"
                style={{ animationDelay: "0.25s" }}
              >
                <Label
                  htmlFor="mobile"
                  className="text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </Label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="mobile"
                    name="mobile"
                    max={10}
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="pl-12 h-14 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="space-y-2 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div
                className="space-y-2 animate-fade-in"
                style={{ animationDelay: "0.35s" }}
              >
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 rounded-xl text-base mt-6 animate-fade-in shadow-lg hover:shadow-primary/25 bg-primary hover:bg-primary/90 text-white"
              style={{ animationDelay: "0.4s" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p
            className="mt-6 text-center text-muted-foreground animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
