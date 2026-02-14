import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email",
  }),
  password: z.string().min(8, {
    message: "Please enter valid password",
  }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email",
  }),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email",
  }),
  otp: z.string().min(6, {
    message: "Please enter valid otp",
  }),
  event: z.string(),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, {
      message: "Token is required",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    password_confirmation: z.string().min(1, {
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
