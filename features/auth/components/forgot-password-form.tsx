"use client";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import authService from "../api.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import { useState, useEffect } from "react";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
  Mail,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { z } from "zod";
import {
  ForgotPasswordSchema,
  VerifyOtpSchema,
  ResetPasswordSchema,
} from "../schema";
import { toast } from "sonner";

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;
type VerifyOtpValues = z.infer<typeof VerifyOtpSchema>;
type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      await authService.resendOtp({ email, event: "forgotPassword" });
      setResendCooldown(60);
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const emailForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<VerifyOtpValues>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: { email: "", otp: "", event: "forgotPassword" },
  });

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onEmailSubmit = async (values: ForgotPasswordValues) => {
    setLoading(true);
    try {
      await authService.forgotPassword(values);
      setEmail(values.email);
      otpForm.setValue("email", values.email);
      toast.success("OTP sent successfully!");
      setStep("otp");
      setResendCooldown(60);
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (values: VerifyOtpValues) => {
    setLoading(true);
    try {
      const response: any = await authService.verifyOtp(values);
      const receivedToken = response?.token || response?.reset_token;
      if (receivedToken) {
        setToken(receivedToken);
        resetForm.setValue("token", receivedToken);
        setStep("reset");
      } else {
        console.error("Invalid response from server. Token missing.");
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const onResetSubmit = async (values: ResetPasswordValues) => {
    setLoading(true);
    try {
      await authService.resetPassword({
        password: values.password,
        token: values.token,
      });
      toast.success("Password reset successfully!");
      router.push("/auth/login");
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Step indicator config
  const steps = [
    { key: "email", label: "Email", icon: Mail },
    { key: "otp", label: "Verify", icon: ShieldCheck },
    { key: "reset", label: "Reset", icon: KeyRound },
  ];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

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

        <div className="w-full max-w-[440px] mx-auto animate-slide-up flex flex-col items-start mt-8">

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

          {/* Step Progress Indicator */}
          <div className="flex items-center gap-0 mb-10 w-full">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      i < currentStepIndex
                        ? "bg-[#1fc0c7] text-white shadow-md"
                        : i === currentStepIndex
                        ? "text-white shadow-lg"
                        : "bg-slate-100 text-slate-400"
                    }`}
                    style={
                      i === currentStepIndex
                        ? { background: "linear-gradient(135deg, #1fc0c7, #0891b2)" }
                        : {}
                    }
                  >
                    {i < currentStepIndex ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <s.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold tracking-wide ${
                      i <= currentStepIndex ? "text-[#1fc0c7]" : "text-slate-300"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500 ${
                      i < currentStepIndex ? "bg-[#1fc0c7]" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP: EMAIL ── */}
          {step === "email" && (
            <div className="w-full animate-fade-in">
              <div className="mb-8 flex flex-col items-start">
                <div
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5"
                  style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-orange-500">
                    Password Recovery
                  </span>
                </div>
                <h1 className="text-[36px] leading-[1.1] font-extrabold text-slate-900 mb-3 tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-slate-500 text-[15px] font-medium leading-relaxed">
                  Enter your email to receive a verification code
                </p>
              </div>

              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
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

                  <Button
                    type="submit"
                    className="w-full h-[54px] text-white rounded-2xl text-[15px] font-extrabold shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(31,192,199,0.35)] hover:-translate-y-0.5 active:translate-y-0 border-0 mt-2"
                    style={{ background: "linear-gradient(135deg, #1fc0c7 0%, #0891b2 100%)" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending Code...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        Send Verification Code
                        <ArrowRight className="w-[18px] h-[18px] mt-[1px]" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>

              <p className="mt-8 text-center text-slate-400 font-semibold text-[14px]">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-[#1fc0c7] font-extrabold hover:text-[#0891b2] transition-colors ml-1">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* ── STEP: OTP ── */}
          {step === "otp" && (
            <div className="animate-fade-in w-full flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, rgba(31,192,199,0.15), rgba(8,145,178,0.08))", border: "1.5px solid rgba(31,192,199,0.25)" }}
              >
                <ShieldCheck className="h-10 w-10 text-[#1fc0c7]" />
              </div>

              <div
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5"
                style={{ background: "linear-gradient(135deg, rgba(31,192,199,0.1), rgba(8,145,178,0.06))", border: "1px solid rgba(31,192,199,0.2)" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1fc0c7]" />
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#1fc0c7]">
                  Verify OTP
                </span>
              </div>

              <h1 className="text-[34px] leading-[1.1] font-extrabold text-slate-900 mb-3 tracking-tight text-center">
                Enter Verification Code
              </h1>
              <p className="text-slate-500 text-[15px] font-medium text-center mb-2 max-w-sm">
                We sent a 6-digit code to
              </p>
              <span className="font-extrabold text-[#1fc0c7] text-[15px] mb-10 text-center block">
                {email}
              </span>

              <Form {...otpForm}>
                <form
                  onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                  className="w-full space-y-8 flex flex-col items-center"
                >
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="animate-fade-in flex flex-col items-center" style={{ animationDelay: "0.2s" }}>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={(value) => field.onChange(value.replace(/\D/g, ""))}
                            autoFocus
                          >
                            <InputOTPGroup className="gap-2 sm:gap-3">
                              {[0, 1, 2, 3, 4, 5].map((i) => (
                                <InputOTPSlot
                                  key={i}
                                  index={i}
                                  className="w-12 h-[60px] sm:w-[56px] sm:h-[68px] text-2xl sm:text-[28px] font-extrabold bg-slate-50 border-2 border-slate-100 rounded-[18px] shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-[#1fc0c7]/30 focus-visible:border-[#1fc0c7] transition-all text-slate-800"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-[54px] text-white rounded-2xl text-[15px] font-extrabold shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(31,192,199,0.35)] hover:-translate-y-0.5 active:translate-y-0 border-0"
                    style={{ background: "linear-gradient(135deg, #1fc0c7 0%, #0891b2 100%)" }}
                    disabled={loading}
                  >
                    {loading ? (
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

                  <p className="text-center text-[14px] text-slate-400 font-semibold">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      className="text-[#1fc0c7] font-extrabold hover:text-[#0891b2] transition-colors disabled:opacity-40 ml-0.5"
                      onClick={handleResendOtp}
                      disabled={loading || resendCooldown > 0}
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Click to Resend"}
                    </button>
                  </p>
                </form>
              </Form>
            </div>
          )}

          {/* ── STEP: RESET PASSWORD ── */}
          {step === "reset" && (
            <div className="w-full animate-fade-in">
              <div className="mb-8 flex flex-col items-start">
                <div
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5"
                  style={{ background: "linear-gradient(135deg, rgba(31,192,199,0.1), rgba(8,145,178,0.06))", border: "1px solid rgba(31,192,199,0.2)" }}
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#1fc0c7]" />
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#1fc0c7]">
                    New Password
                  </span>
                </div>
                <h1 className="text-[36px] leading-[1.1] font-extrabold text-slate-900 mb-3 tracking-tight">
                  Reset Password
                </h1>
                <p className="text-slate-500 text-[15px] font-medium leading-relaxed">
                  Create a strong new password for your account
                </p>
              </div>

              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-5">
                  <FormField
                    control={resetForm.control}
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

                  <FormField
                    control={resetForm.control}
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
                    style={{ background: "linear-gradient(135deg, #1fc0c7 0%, #0891b2 100%)", animationDelay: "0.4s" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating Password...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        Update Password
                        <ArrowRight className="w-[18px] h-[18px] mt-[1px]" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT SIDE — DECORATIVE ─── */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1fc0c7 0%, #0e9aa7 40%, #0891b2 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-16 right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-24 left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />

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
          {/* Icon */}
          <div className="w-28 h-28 flex items-center justify-center mx-auto mb-10 animate-bounce-in bg-white/15 rounded-3xl backdrop-blur-sm border border-white/20">
            <ShieldCheck className="h-14 w-14 text-white drop-shadow-lg" />
          </div>

          <h2 className="text-[40px] font-extrabold mb-5 animate-slide-up tracking-tight leading-tight">
            Secure Account
            <br />
            <span className="text-white/80">Recovery</span>
          </h2>

          <p className="text-white/75 text-lg animate-fade-in leading-relaxed mb-10 max-w-sm" style={{ animationDelay: "0.3s" }}>
            We take security seriously. Follow the steps to safely reset your password and regain access to your dashboard.
          </p>

          {/* Step cards */}
          <div className="space-y-3 text-left w-full animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {[
              { icon: Mail, title: "Enter Email", desc: "Provide your registered email" },
              { icon: ShieldCheck, title: "Verify OTP", desc: "Enter the 6-digit code sent" },
              { icon: KeyRound, title: "New Password", desc: "Set a strong new password" },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                  i === currentStepIndex
                    ? "bg-white/20 border-white/30"
                    : i < currentStepIndex
                    ? "bg-white/15 border-white/20"
                    : "bg-white/8 border-white/10"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${i <= currentStepIndex ? "bg-white/25" : "bg-white/10"}`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className={`font-bold text-sm ${i <= currentStepIndex ? "text-white" : "text-white/60"}`}>{item.title}</p>
                  <p className={`text-xs mt-0.5 ${i <= currentStepIndex ? "text-white/70" : "text-white/40"}`}>{item.desc}</p>
                </div>
                {i < currentStepIndex && (
                  <CheckCircle2 className="w-4 h-4 text-white ml-auto" />
                )}
                {i === currentStepIndex && (
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse ml-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
