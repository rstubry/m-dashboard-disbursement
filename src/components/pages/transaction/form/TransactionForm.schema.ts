import { z } from "zod";
import type { CreateTransactionPayload } from "@/models/transaction";

export type TransactionFormValues = Omit<CreateTransactionPayload, "admin_fee" | "status">;

export const formSchema = z.object({
  sender_name: z
    .string()
    .min(3, "Minimal 3 karakter")
    .max(100, "Maksimal 100 karakter"),
  account_number: z
    .string()
    .regex(/^\d{6,20}$/, "Nomor rekening harus 6–20 digit angka"),
  bank: z.enum(
    [
      "BCA",
      "BRI",
      "BNI",
      "Mandiri",
      "BSI",
      "CIMB Niaga",
      "Permata",
      "Danamon",
      "BTN",
    ],
    { message: "Pilih bank tujuan" },
  ),
  amount: z
    .number({ message: "Harus berupa angka" })
    .int("Harus angka bulat")
    .min(10000, "Minimal Rp 10.000"),
  note: z.string().max(255, "Maksimal 255 karakter"),
});

export function calcAdminFee(amount: number): number {
  return amount >= 5_000_000 ? 5000 : 2500;
}
