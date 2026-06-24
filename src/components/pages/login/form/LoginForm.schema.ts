import { z } from "zod";

export const CREDENTIALS = {
  admin: { password: "admin123", role: "admin" as const },
  operator: { password: "operator123", role: "operator" as const },
};

export const schema = z.object({
  username: z
    .string()
    .min(1, "Username wajib diisi")
    .refine((v) => v.trim().length > 0, "Tidak boleh spasi saja"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .refine((v) => v.trim().length > 0, "Tidak boleh spasi saja"),
});

export type FormValues = z.infer<typeof schema>;
