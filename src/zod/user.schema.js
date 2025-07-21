import { z } from "zod";
import { objectIdValidation, stringValidation} from "../utils/customValidator.js"

const passwordSchema = z
  .string()
  .refine((value) => /[0-9]/.test(value), {
    message: "Password must contain at least one numerical digit.",
  })
  .refine((value) => /[!@#$%^&*]/.test(value), {
    message: "Password must contain at least one special character.",
  });

export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(50, { message: "Email must be no more than 50 characters long" }),
  name: stringValidation(1, 20, "name"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(50, { message: "Email must be no more than 50 characters long" }),
  password: passwordSchema,
});

