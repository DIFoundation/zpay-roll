import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name is required"),

    email: z
      .string()
      .min(1, "Email is required")
      .email(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine(
    (values) => values.password === values.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export type LoginSchema = z.infer<typeof loginSchema>;

export type RegisterSchema = z.infer<typeof registerSchema>;