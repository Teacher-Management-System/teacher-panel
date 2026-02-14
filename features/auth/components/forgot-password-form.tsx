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
import { useState } from "react";
import { Loader2, ArrowLeft, ShieldCheck, LockKeyhole } from "lucide-react";
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
      if (response) {
        const receivedToken = response;
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-2xl border-t-4 border-t-primary overflow-hidden">
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            {step === "otp" && <ShieldCheck className="h-6 w-6 text-primary" />}
            {step === "reset" && (
              <LockKeyhole className="h-6 w-6 text-primary" />
            )}
            {getStepTitle()}
          </CardTitle>
          <CardDescription className="max-w-[280px] mx-auto">
            {getStepDescription()}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          {step === "email" && (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="grid gap-6"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          type="email"
                          className="h-12 bg-gray-50/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-primary/20"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Receive OTP
                </Button>
              </form>
            </Form>
          )}

          {step === "otp" && (
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                className="grid gap-8"
              >
                <div className="flex flex-col items-center">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center gap-3">
                        <FormControl>
                          <InputOTP maxLength={6} {...field} autoFocus>
                            <InputOTPGroup className="gap-2">
                              <InputOTPSlot
                                index={0}
                                className="w-11 h-11 text-lg border-2"
                              />
                              <InputOTPSlot
                                index={1}
                                className="w-11 h-11 text-lg border-2"
                              />
                              <InputOTPSlot
                                index={2}
                                className="w-11 h-11 text-lg border-2"
                              />
                              <InputOTPSlot
                                index={3}
                                className="w-11 h-11 text-lg border-2"
                              />
                              <InputOTPSlot
                                index={4}
                                className="w-11 h-11 text-lg border-2"
                              />
                              <InputOTPSlot
                                index={5}
                                className="w-11 h-11 text-lg border-2"
                              />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-primary/20"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Verify Code
                </Button>
              </form>
            </Form>
          )}

          {step === "reset" && (
            <Form {...resetForm}>
              <form
                onSubmit={resetForm.handleSubmit(onResetSubmit)}
                className="grid gap-5"
              >
                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          className="h-12 bg-gray-50/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          className="h-12 bg-gray-50/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-primary/20 mt-2"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Update Password
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
