import { z } from "zod";

const passwordSchema = z
  .string().min(6, { message: "Password must be at least 6 characters long" })
  .refine((value) => /[0-9]/.test(value), {
    message: "Password must contain at least one numerical digit.",
  })
  .refine((value) => /[!@#$%^&*]/.test(value), {
    message: "Password must contain at least one special character.",
  });

export const registerSchema = z.object({
  email: z.string().email().min(5).max(50),
  name: z.string().trim().min(1).max(20),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email().min(5).max(50),
  password: passwordSchema,
});

