import z from "zod";

export const registerSchema = z.object({
  full_name: z.string().min(3).max(100),
  email: z.email().transform(val => val.toLowerCase()),
  password: z.string().min(6).max(50),
});

export const loginSchema = z.object({
  email: z.email().transform(val => val.toLowerCase()),
  password: z.string().min(6).max(50),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;