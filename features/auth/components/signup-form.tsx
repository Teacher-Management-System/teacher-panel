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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
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
      if (response) {
        toast.success("Account created! Please verify OTP sent to your email.");
        setShowOtp(true);
      }
    } catch (error: any) {
      console.error(error.message || "Failed to create account");
      toast.error(error.message || "Failed to create account");
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
        email: formData.email,
        otp: otp,
      });
      if (response?.auth_token) {
        cookieService.setCookie("user", JSON.stringify(response.user));
        cookieService.setCookie("authToken", response.auth_token);
        router.push("/dashboard");
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "OTP Verification failed");
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
                    {formData.email}
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
                    className="text-primary font-semibold hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                    onClick={() => toast.info("Resend logic here")}
                  >
                    Click to Resend
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

              <form onSubmit={handleSignup} className="space-y-5">
                {/* ... Existing Signup Fields ... */}
                {/* I will invoke replace_file_content carefully to keep the existing form fields if I can, but since I am restructuring the render, it's safer to provide the full block or use a large chunk replacement. Given constraints, I will replace the component content. */}
                {/* Actually, I should use the previous content for fields to avoid re-writing them all if they are complex. */}
                {/* However, the tool requires providing the ReplacementContent. I'll paste the updated form content here. */}

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
                      className="pl-12 h-14 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 hover:border-gray-300"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    className="space-y-1.5 animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground/80"
                    >
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-11 rounded-lg border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/50"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div
                    className="space-y-1.5 animate-fade-in"
                    style={{ animationDelay: "0.25s" }}
                  >
                    <Label
                      htmlFor="mobile"
                      className="text-sm font-medium text-foreground/80"
                    >
                      Mobile Number
                    </Label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="mobile"
                        name="mobile"
                        maxLength={10}
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10 h-11 rounded-lg border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/50"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    className="space-y-1.5 animate-fade-in"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground/80"
                    >
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-11 rounded-lg border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/50"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div
                    className="space-y-1.5 animate-fade-in"
                    style={{ animationDelay: "0.35s" }}
                  >
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-foreground/80"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-11 rounded-lg border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/50"
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
                  className="w-full h-12 rounded-lg text-base mt-4 animate-slide-up shadow-md hover:shadow-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white transition-all duration-300 transform active:scale-[0.98]"
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
