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
      const values = form.getValues();
      const response: any = await authService.register(values);
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
        router.push("/dashboard");
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
    "Unlimited Student Records",
    "Payment Tracking",
    "Secure Dashboard",
    "24/7 Support",
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">
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
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 bg-white">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-[14px]">Back to Home</span>
        </Link>
        <div className="w-full max-w-[480px] animate-slide-up flex flex-col items-center">
          {/* Logo */}
          {!showOtp && (
            <Link href="/" className="flex items-center gap-3 mb-10 group justify-center">
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
          )}

          {showOtp ? (
            <div className="animate-fade-in w-full flex flex-col items-center mt-6">
              <div className="h-[88px] w-[88px] bg-primary/10 rounded-[28px] flex items-center justify-center mb-6">
                <ShieldCheck className="h-11 w-11 text-primary" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary mb-5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-extrabold tracking-widest uppercase mt-0.5">
                  Verification Pending
                </span>
              </div>
              <h1 className="text-[38px] leading-[1.1] font-extrabold text-[#0f172a] mb-3 tracking-tight text-center">
                Enter Verification Code
              </h1>
              <p className="text-[#64748b] text-[16px] font-medium text-center mb-10 max-w-sm">
                We have sent a 6-digit code to your email <br />
                <span className="font-extrabold text-[#0f172a] mt-1.5 block">
                  {registeredEmail}
                </span>
              </p>

              <form onSubmit={handleVerifyOtp} className="w-full space-y-10 flex flex-col items-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value.replace(/\D/g, ""))}
                  autoFocus
                >
                  <InputOTPGroup className="gap-2 sm:gap-4">
                    {[0,1,2,3,4,5].map(i => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-12 h-[60px] sm:w-[60px] sm:h-[72px] text-2xl sm:text-[32px] font-extrabold bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-[18px] shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <Button
                  type="submit"
                  className="w-full h-[56px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-[16px] font-extrabold shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      Verify & Proceed
                      <ArrowRight className="w-[18px] h-[18px] mt-[1px]" />
                    </div>
                  )}
                </Button>

                <p className="text-center text-[15px] text-muted-foreground font-semibold">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    className="text-primary font-extrabold hover:text-primary/80 transition-colors disabled:opacity-50 ml-0.5"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isLoading}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Click to Resend"}
                  </button>
                </p>
              </form>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div
                className="mb-10 animate-fade-in flex flex-col items-center text-center w-full"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-extrabold tracking-widest uppercase mt-0.5">
                    Get Started Free
                  </span>
                </div>
                <h1 className="text-[38px] leading-[1.1] font-extrabold text-[#0f172a] mb-3 tracking-tight">
                  Create Account
                </h1>
                <p className="text-[#64748b] text-[16px] font-medium">
                  Fill in your details to get started
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSignupSubmit)}
                  className="space-y-4 w-full"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem
                        className="space-y-1.5 animate-fade-in"
                        style={{ animationDelay: "0.15s" }}
                      >
                        <FormLabel className="text-[11px] font-extrabold text-[#7489a2] uppercase tracking-[0.15em] pl-1">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                            <Input
                              placeholder="John Doe"
                              className="pl-[52px] h-[56px] bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-semibold text-slate-700 text-[15px]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem
                          className="space-y-1.5 animate-fade-in"
                          style={{ animationDelay: "0.2s" }}
                        >
                          <FormLabel className="text-[11px] font-extrabold text-[#7489a2] uppercase tracking-[0.15em] pl-1">
                            Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                className="pl-[52px] h-[56px] bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-semibold text-slate-700 text-[15px]"
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
                        <FormItem
                          className="space-y-1.5 animate-fade-in"
                          style={{ animationDelay: "0.25s" }}
                        >
                          <FormLabel className="text-[11px] font-extrabold text-[#7489a2] uppercase tracking-[0.15em] pl-1">
                            Mobile Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                              <Input
                                maxLength={10}
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="pl-[52px] h-[56px] bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-semibold text-slate-700 text-[15px]"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem
                          className="space-y-1.5 animate-fade-in"
                          style={{ animationDelay: "0.3s" }}
                        >
                          <FormLabel className="text-[11px] font-extrabold text-[#7489a2] uppercase tracking-[0.15em] pl-1">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-[52px] pr-11 h-[56px] bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-bold text-slate-700 text-[18px] pb-1 tracking-[0.2em]"
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

                    <FormField
                      control={form.control}
                      name="password_confirmation"
                      render={({ field }) => (
                        <FormItem
                          className="space-y-1.5 animate-fade-in"
                          style={{ animationDelay: "0.35s" }}
                        >
                          <FormLabel className="text-[11px] font-extrabold text-[#7489a2] uppercase tracking-[0.15em] pl-1">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-[52px] pr-11 h-[56px] bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-bold text-slate-700 text-[18px] pb-1 tracking-[0.2em]"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors z-10"
                              >
                                {showConfirmPassword ? (
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
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-[56px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-[16px] font-extrabold shadow-[0_8px_20px_-6px_rgba(var(--primary),0.5)] transition-all animate-fade-in"
                    style={{ animationDelay: "0.4s" }}
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

              <p
                className="mt-8 text-center text-muted-foreground font-semibold text-[15px] animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-extrabold hover:text-primary/80 transition-colors ml-1"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
