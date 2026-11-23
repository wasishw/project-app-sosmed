import { z } from "zod";

/** Mirrors the API rules (POST /api/auth/register & /login). */
export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").pipe(z.email("Enter a valid email")),
  password: z.string().min(1, "Password is required").min(6, "Password min 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    username: z
      .string()
      .trim()
      .min(3, "Username min 3 characters")
      .regex(/^[A-Za-z0-9._]+$/, "Only letters, numbers, dot and underscore"),
    email: z.string().trim().min(1, "Email is required").pipe(z.email("Enter a valid email")),
    phone: z
      .string()
      .trim()
      .min(1, "Number phone is required")
      .regex(/^\+?\d{8,15}$/, "Enter a valid number phone"),
    password: z.string().min(6, "Password min 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
