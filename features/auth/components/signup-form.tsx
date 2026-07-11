"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Award,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import NextImage from "next/image";
import authService from "../api.service";
import { cookieService } from "@/lib/cookie";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../schema";
import { z } from "zod";

type RegisterValues = z.infer<typeof RegisterSchema>;

export function SignupForm() {
  const router = useRouter();
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      country_code: "+91",
      password: "",
      password_confirmation: "",
    },
  });

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const onSignupSubmit = async (values: RegisterValues) => {
    setIsLoading(true);
    try {
      values.email = values.email.toLowerCase();
      const response: any = await authService.register(values);
      if (response) {
        setRegisteredEmail(values.email);
        toast.success("Account created! Please verify OTP sent to your email.");
        setShowOtp(true);
        setResendCooldown(60);
      }
    } catch (error: any) {
      console.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    try {
      const response: any = await authService.resendOtp({
        email: registeredEmail,
        event: "register",
      });
      if (response) {
        toast.success("OTP resent successfully!");
        setResendCooldown(60);
      }
    } catch (error: any) {
      console.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);

    try {
      const response: any = await authService.verifyOtp({
        email: registeredEmail,
        otp: otp,
        event: "register",
      });
      if (response?.auth_token) {
        cookieService.setCookie("user", JSON.stringify(response.user));
        cookieService.setCookie("authToken", response.auth_token);
        window.location.href = "/dashboard";
      } else {
        console.error("Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: GraduationCap, text: "Unlimited Student Records" },
    { icon: BookOpen, text: "Payment & Fee Tracking" },
    { icon: Award, text: "Progress Analytics" },
    { icon: Rocket, text: "24/7 Priority Support" },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white">

      {/* ─── LEFT SIDE — DECORATIVE ─── */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1fc0c7 0%, #0e9aa7 40%, #0891b2 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-16 left-16 w-40 h-40 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-24 right-16 w-28 h-28 bg-white/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 left-8 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-white/8 rounded-full animate-pulse-slow" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(to_right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to_bottom, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Floating dots */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/25 rounded-full animate-float"
            style={{
              top: `${15 + i * 16}%`,
              left: `${8 + i * 6}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + i * 0.5}s`,
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
            Start Managing
            <br />
            <span className="text-white/80">Students Today</span>
          </h2>

          <p className="text-white/75 text-lg animate-fade-in leading-relaxed mb-10" style={{ animationDelay: "0.3s" }}>
            Create your account and get access to the complete student management panel after payment verification.
          </p>

          {/* Feature list */}
          <div className="space-y-3 text-left animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:translate-x-2 border border-white/15 hover:bg-white/15 cursor-default"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-white text-[15px]">{feature.text}</span>
                <CheckCircle2 className="w-4 h-4 text-white/50 ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── RIGHT SIDE — FORM ─── */}
      <div className="flex-1 flex items-center justify-center relative z-10 bg-white overflow-y-auto">

        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-[#1fc0c7] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Home</span>
        </Link>

        <div className="w-full max-w-[560px] animate-slide-up flex flex-col items-center px-6 md:px-10 py-8">
          {/* Logo (mobile + OTP hidden state handled inline) */}
          {!showOtp && (
            <Link href="/" className="flex items-center gap-3 mb-5 group justify-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden border border-slate-100 shadow-sm group-hover:scale-110 transition-transform duration-300 bg-white">
                <NextImage src="/logo-icon.png" alt="Aerophantom Logo" width={300} height={300} className="w-full h-full object-cover" unoptimized />
              </div>
              <span className="font-extrabold text-[22px] text-slate-900 tracking-tight">Aerophantom</span>
            </Link>
          )}

          {showOtp ? (
            /* ── OTP Verification ── */
            <div className="animate-fade-in w-full flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, rgba(31,192,199,0.15), rgba(8,145,178,0.08))", border: "1.5px solid rgba(31,192,199,0.25)" }}
              >
                <ShieldCheck className="h-10 w-10 text-[#1fc0c7]" />
              </div>

              <div
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5"
                style={{ background: "linear-gradient(135deg, rgba(31,192,199,0.12), rgba(8,145,178,0.08))", border: "1px solid rgba(31,192,199,0.2)" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1fc0c7]" />
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#1fc0c7]">
                  Verification Pending
                </span>
              </div>

              <h1 className="text-[36px] leading-[1.1] font-extrabold text-slate-900 mb-3 tracking-tight text-center">
                Enter Verification Code
              </h1>
              <p className="text-slate-400 text-[15px] font-medium text-center mb-2 max-w-sm">
                We have sent a 6-digit code to your email
              </p>
              <span className="font-extrabold text-[#1fc0c7] text-[15px] mb-10 text-center block">
                {registeredEmail}
              </span>

              <form onSubmit={handleVerifyOtp} className="w-full space-y-8 flex flex-col items-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value.replace(/\D/g, ""))}
                  autoFocus
                >
                  <InputOTPGroup className="gap-2 sm:gap-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-12 h-[60px] sm:w-[60px] sm:h-[72px] text-2xl sm:text-[32px] font-extrabold bg-slate-50 border-2 border-slate-100 rounded-[18px] shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-[#1fc0c7]/30 focus-visible:border-[#1fc0c7] transition-all text-slate-800"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <Button
                  type="submit"
                  className="w-full h-[54px] text-white rounded-2xl text-[15px] font-extrabold shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(31,192,199,0.35)] hover:-translate-y-0.5 active:translate-y-0 border-0"
                  style={{ background: "linear-gradient(135deg, #1fc0c7 0%, #0891b2 100%)" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      Verify &amp; Proceed
                      <ArrowRight className="w-[18px] h-[18px] mt-[1px]" />
                    </div>
                  )}
                </Button>

                <p className="text-center text-[15px] text-slate-400 font-semibold">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    className="text-[#1fc0c7] font-extrabold hover:text-[#0891b2] transition-colors disabled:opacity-40 ml-0.5"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isLoading}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Click to Resend"}
                  </button>
                </p>
              </form>
            </div>
          ) : (
            /* ── Registration Form ── */
            <div className="w-full flex flex-col items-center">
              <div className="mb-5 animate-fade-in flex flex-col items-center text-center w-full" style={{ animationDelay: "0.1s" }}>
                <div
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-3.5"
                  style={{ background: "linear-gradient(135deg, rgba(31,192,199,0.12), rgba(8,145,178,0.08))", border: "1px solid rgba(31,192,199,0.2)" }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#1fc0c7]" />
                  <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#1fc0c7]">
                    Get Started Free
                  </span>
                </div>
                <h1 className="text-[36px] leading-[1.1] font-extrabold text-slate-900 mb-2 tracking-tight">
                  Create Account
                </h1>
                <p className="text-slate-500 text-[15px] font-medium">
                  Fill in your details to get started
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSignupSubmit)} className="space-y-3.5 w-full">

                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                        <FormLabel className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] pl-1">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 group-focus-within:text-[#1fc0c7] transition-colors z-10" />
                            <Input
                              placeholder="John Doe"
                              className="pl-[50px] h-[48px] bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-[#1fc0c7]/30 focus-visible:border-[#1fc0c7] transition-all font-semibold text-slate-700 text-[15px] placeholder:text-slate-300 hover:border-slate-200"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email + Mobile Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                          <FormLabel className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] pl-1">Email</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 group-focus-within:text-[#1fc0c7] transition-colors z-10" />
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                className="pl-[50px] h-[48px] bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-[#1fc0c7]/30 focus-visible:border-[#1fc0c7] transition-all font-semibold text-slate-700 text-[15px] placeholder:text-slate-300 hover:border-slate-200"
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
                      name="mobile"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.25s" }}>
                          <FormLabel className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] pl-1">Mobile</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 group-focus-within:text-[#1fc0c7] transition-colors z-10" />
                              <Input
                                maxLength={10}
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                className="pl-[50px] h-[48px] bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-[#1fc0c7]/30 focus-visible:border-[#1fc0c7] transition-all font-semibold text-slate-700 text-[15px] placeholder:text-slate-300 hover:border-slate-200"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, "");
                                  field.onChange(value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>                    {/* Password + Confirm Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-0.5">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                          <FormLabel className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] pl-1">Password</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 group-focus-within:text-[#1fc0c7] transition-colors z-10" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-[50px] pr-11 h-[48px] bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-[#1fc0c7]/30 focus-visible:border-[#1fc0c7] transition-all font-bold text-slate-700 text-[18px] pb-1 tracking-[0.2em] placeholder:tracking-normal placeholder:text-slate-300 hover:border-slate-200"
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
 
                    <FormField
                      control={form.control}
                      name="password_confirmation"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.35s" }}>
                          <FormLabel className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] pl-1">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-300 group-focus-within:text-[#1fc0c7] transition-colors z-10" />
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-[50px] pr-11 h-[48px] bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-[#1fc0c7]/30 focus-visible:border-[#1fc0c7] transition-all font-bold text-slate-700 text-[18px] pb-1 tracking-[0.2em] placeholder:tracking-normal placeholder:text-slate-300 hover:border-slate-200"
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
                  </div>
 
                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-[48px] text-white rounded-2xl text-[15px] font-extrabold shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(31,192,199,0.35)] hover:-translate-y-0.5 active:translate-y-0 animate-fade-in border-0"
                    style={{ background: "linear-gradient(135deg, #1fc0c7 0%, #0891b2 100%)", animationDelay: "0.4s" }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        Create Account
                        <ArrowRight className="w-[18px] h-[18px] mt-[1px]" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>

              <p className="mt-4 text-center text-slate-400 font-semibold text-[15px] animate-fade-in" style={{ animationDelay: "0.5s" }}>
                Already have an account?{" "}
                <Link href="/auth/login" className="text-[#1fc0c7] font-extrabold hover:text-[#0891b2] transition-colors ml-1">
                  Sign in
                </Link>
              </p>

              <div className="flex items-center justify-center gap-2 mt-3.5 text-slate-300 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Secure registration · Your data is protected</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
