import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email",
  }),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character.",
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
    password: z
      .string()
      .min(4, {
        message: "Password must be at least 4 characters.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character.",
      }),
    password_confirmation: z.string().min(1, {
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export const RegisterSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter valid email",
    }),
    mobile: z.string().min(10, {
      message: "Please enter valid mobile number",
    }),
    country_code: z.string().min(1, {
      message: "Country code is required",
    }),
    password: z
      .string()
      .min(4, {
        message: "Password must be at least 4 characters.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character.",
      }),
    password_confirmation: z.string().min(1, {
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
