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
      {/* ... Left Side Content (Keep as is) ... */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">
        {/* ... (Keep existing left side content) ... */}
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
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 bg-white">
        <div className="w-full max-w-xl animate-slide-up">
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

          {showOtp ? (
            <div className="animate-fade-in w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 ring-1 ring-primary/20 bg-white/50 backdrop-blur-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Verification Pending
                  </span>
                </div>
                <h1 className="font-display text-3xl font-bold text-foreground mb-3 tracking-tight">
                  Enter Verification Code
                </h1>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed">
                  We have sent a 6-digit code to your email <br />
                  <span className="font-semibold text-foreground">
                    {registeredEmail}
                  </span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup className="gap-2 sm:gap-4">
                      <InputOTPSlot
                        index={0}
                        className="w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg text-lg font-semibold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg text-lg font-semibold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg text-lg font-semibold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg text-lg font-semibold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg text-lg font-semibold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg text-lg font-semibold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 rounded-xl text-base font-semibold shadow-lg hover:shadow-primary/25 bg-primary hover:bg-primary/90 text-white transition-all duration-300 transform active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying Code...
                    </div>
                  ) : (
                    <>
                      Verify & Proceed
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    className="text-primary font-semibold hover:text-primary/80 transition-colors underline-offset-4 hover:underline disabled:opacity-50 disabled:no-underline"
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
            <>
              {/* Header and Signup Form */}
              <div
                className="mb-6 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Get Started Free
                  </span>
                </div>
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  Create Account
                </h1>
                <p className="text-muted-foreground text-sm">
                  Fill in your details to get started
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSignupSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem
                        className="space-y-2 animate-fade-in"
                        style={{ animationDelay: "0.15s" }}
                      >
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <Input
                              placeholder="John Doe"
                              className="pl-12 h-14 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 hover:border-gray-300"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem
                          className="space-y-1.5 animate-fade-in"
                          style={{ animationDelay: "0.2s" }}
                        >
                          <FormLabel className="text-sm font-medium text-foreground/80">
                            Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                className="pl-10 h-11 rounded-lg border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/50"
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
                          <FormLabel className="text-sm font-medium text-foreground/80">
                            Mobile Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input
                                maxLength={10}
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="pl-10 h-11 rounded-lg border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/50"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem
                          className="space-y-1.5 animate-fade-in"
                          style={{ animationDelay: "0.3s" }}
                        >
                          <FormLabel className="text-sm font-medium text-foreground/80">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 h-11 rounded-lg border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/50"
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
                      name="password_confirmation"
                      render={({ field }) => (
                        <FormItem
                          className="space-y-1.5 animate-fade-in"
                          style={{ animationDelay: "0.35s" }}
                        >
                          <FormLabel className="text-sm font-medium text-foreground/80">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 h-11 rounded-lg border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/50"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 rounded-lg text-base font-semibold mt-4 animate-slide-up shadow-md hover:shadow-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white transition-all duration-300 transform active:scale-[0.98]"
                    style={{ animationDelay: "0.4s" }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <p
                className="mt-6 text-center text-sm text-muted-foreground animate-fade-in"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
