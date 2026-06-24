import { z } from "zod";

export const CREDENTIALS = {
  admin: { password: "admin123", role: "admin" as const },
  operator: { password: "operator123", role: "operator" as const },
};

export const schema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .refine((v) => v.trim().length > 0, "Cannot be only spaces"),
  password: z
    .string()
    .min(1, "Password is required")
    .refine((v) => v.trim().length > 0, "Cannot be only spaces"),
});

export type FormValues = z.infer<typeof schema>;
