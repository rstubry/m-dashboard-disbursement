import type { Bank, TransactionStatus } from "@/models/transaction";

export const STATUS_VARIANT: Record<TransactionStatus, "default" | "outline" | "destructive"> = {
  PENDING: "outline",
  SUCCESS: "default",
  FAILED: "destructive",
  APPROVED: "default",
  REJECTED: "destructive",
};

export const BANKS: Bank[] = [
  "BCA",
  "BRI",
  "BNI",
  "Mandiri",
  "BSI",
  "CIMB Niaga",
  "Permata",
  "Danamon",
  "BTN",
];
