import { z } from "zod";
import type { CreateTransactionPayload } from "@/models/transaction";

export type TransactionFormValues = Omit<CreateTransactionPayload, "admin_fee" | "status">;

export const formSchema = z.object({
  sender_name: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  account_number: z
    .string()
    .regex(/^\d{6,20}$/, "Account number must be 6–20 digits"),
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
    { message: "Select a bank" },
  ),
  amount: z
    .number({ message: "Must be a number" })
    .int("Must be a whole number")
    .min(10000, "Minimum Rp 10,000"),
  note: z.string().max(255, "Maximum 255 characters"),
});

export function calcAdminFee(amount: number): number {
  return amount >= 5_000_000 ? 5000 : 2500;
}
