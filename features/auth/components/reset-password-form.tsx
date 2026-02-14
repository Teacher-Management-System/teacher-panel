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
import authService from "../api.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { cookieService } from "@/lib/cookie";
import { ResetPasswordSchema } from "../schema";
import { z } from "zod";
import { toast } from "sonner";

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const maskedEmail = email ? email.replace(/(.{3})(.*)(@.*)/, "$1•••$3") : "";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: token || "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    setLoading(true);
    authService
      .resetPassword({
        password: values.password,
        token: values.token,
      })
      .then((response: any) => {
        router.push("/auth/login");
      })
      .catch((error: any) => {
        console.error(
          error.response?.data?.message || "Failed to reset password",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-2xl border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <LockKeyhole className="h-6 w-6 text-primary" />
            Reset Password
          </CardTitle>
          <CardDescription>
            Reset password for{" "}
            <span className="font-medium">{maskedEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token && (
            <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-center gap-2">
              <span>⚠️ Invalid or missing reset token.</span>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
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
                control={form.control}
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
                className="w-full h-12"
                disabled={loading || !token}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Reset Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
