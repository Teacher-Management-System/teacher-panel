"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2, ArrowLeft, ArrowRight, ShieldCheck, LockKeyhole, Mail, CheckCircle2 } from "lucide-react";
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
      console.log(response, "OTP Response");
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
      router.push("/auth/login");
    } catch (error: any) {
      console.error(
        error.response?.data?.message || "Failed to reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "otp":
        return "Verify OTP";
      case "reset":
        return "New Password";
      default:
        return "Forgot Password";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "otp":
        return `Enter the 6-digit code sent to ${email}`;
      case "reset":
        return "Create a strong new password for your account";
      default:
        return "Enter your email to receive a verification code";
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden w-full bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 relative z-10 bg-white">
        {/* Back to Login Button */}
        <Link
          href="/auth/login"
          className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-[14px]">Back to Login</span>
        </Link>

        <div className="w-full max-w-[440px] mx-auto animate-slide-up flex flex-col items-start mt-8">
          {step !== "otp" && (
            <>
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 mb-8 group">
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
                className="mb-8 animate-fade-in flex flex-col items-start"
                style={{ animationDelay: "0.1s" }}
              >
                {step === "email" && (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-500 mb-5 border border-orange-100 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-extrabold tracking-widest uppercase mt-0.5">
                      PASSWORD RECOVERY
                    </span>
                  </div>
                )}
                
                <h1 className="text-[36px] leading-[1.1] font-extrabold text-[#0f172a] mb-3 tracking-tight">
                  {getStepTitle()}
                </h1>
                <p className="text-muted-foreground text-[16px] font-medium max-w-sm leading-relaxed">
                  {getStepDescription()}
                </p>
              </div>
            </>
          )}

          {/* Form Content */}
          <div className="w-full">
            {step === "email" && (
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={emailForm.control}
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
                  <Button
                    type="submit"
                    className="w-full h-[56px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-[16px] font-extrabold shadow-lg hover:shadow-primary/25 transition-all animate-fade-in mt-2"
                    style={{ animationDelay: "0.3s" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending Code...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        Send OTP
                        <ArrowRight className="w-[18px] h-[18px] mt-[1px]" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            )}

            {step === "otp" && (
              <div className="animate-fade-in w-full flex flex-col items-center mt-2">
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
                    {email}
                  </span>
                </p>

                <Form {...otpForm}>
                  <form
                    onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                    className="w-full space-y-10 flex flex-col items-center"
                  >
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem
                          className="animate-fade-in flex flex-col items-center"
                          style={{ animationDelay: "0.2s" }}
                        >
                          <FormControl>
                            <InputOTP
                              maxLength={6}
                              value={field.value}
                              onChange={(value) => field.onChange(value.replace(/\D/g, ""))}
                              autoFocus
                            >
                              <InputOTPGroup className="gap-2 sm:gap-4">
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                  <InputOTPSlot
                                    key={i}
                                    index={i}
                                    className="w-12 h-[60px] sm:w-[60px] sm:h-[72px] text-2xl sm:text-[32px] font-extrabold bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-[18px] shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
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
                      className="w-full h-[56px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-[16px] font-extrabold shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
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
                        disabled={loading || resendCooldown > 0}
                      >
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : "Click to Resend"}
                      </button>
                    </p>
                  </form>
                </Form>
              </div>
            )}

            {step === "reset" && (
              <Form {...resetForm}>
                <form
                  onSubmit={resetForm.handleSubmit(onResetSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={resetForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem
                        className="space-y-1.5 animate-fade-in"
                        style={{ animationDelay: "0.2s" }}
                      >
                        <FormLabel className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] pl-1">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-[52px] h-[56px] bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-bold text-slate-700 text-[18px] tracking-[0.2em]"
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
                    control={resetForm.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem
                        className="space-y-1.5 animate-fade-in"
                        style={{ animationDelay: "0.3s" }}
                      >
                        <FormLabel className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-[0.15em] pl-1">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-[52px] h-[56px] bg-[#f8f9fa] border-[#f1f5f9] border-2 rounded-2xl shadow-none ring-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-bold text-slate-700 text-[18px] tracking-[0.2em]"
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
                    className="w-full h-[56px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-[16px] font-extrabold shadow-lg hover:shadow-primary/25 transition-all animate-fade-in mt-2"
                    style={{ animationDelay: "0.4s" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
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
            )}

            {/* Back to Login Anchor */}
            {step === "email" && (
              <p
                className="mt-8 text-center text-muted-foreground font-semibold text-[14px] animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-extrabold hover:text-primary/80 transition-colors ml-1"
                >
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Grid Component */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        <div className="text-center text-primary-foreground relative z-10 max-w-lg flex flex-col items-center">
          <div className="h-28 w-28 bg-white rounded-[32px] flex items-center justify-center mb-10 animate-bounce-in shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <ShieldCheck className="h-14 w-14 text-primary" />
          </div>
          
          <h2 className="font-display text-4xl lg:text-[42px] font-extrabold mb-6 animate-slide-up tracking-tight leading-tight">
            Secure Account
            <br />
            Recovery
          </h2>
          
          <p
            className="text-primary-foreground/90 text-[17px] font-medium animate-fade-in mx-auto leading-relaxed"
            style={{ animationDelay: "0.3s" }}
          >
            We take security seriously. Follow the steps to safely reset your password and regain access to your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
