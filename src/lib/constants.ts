import type { Bank, TransactionStatus } from "@/models/transaction";

export const SECRET = "test-secret";
export const COOKIE_NAME = "token";

export const LIMIT_OPTIONS = [10, 25, 50];
export const DEFAULT_LIMIT = 10;
export const MAX_VISIBLE_PAGES = 5;

export const STATUS_OPTIONS: {
  label: string;
  value: TransactionStatus | "";
}[] = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Success", value: "SUCCESS" },
  { label: "Failed", value: "FAILED" },
];

export const STATUS_CLASS: Record<string, string> = {
  PENDING: "border-muted-foreground/30 bg-muted text-muted-foreground",
  SUCCESS:
    "border-green-700 bg-green-50 text-green-700 dark:border-green-300 dark:bg-green-950 dark:text-green-300",
  APPROVED:
    "border-green-700 bg-green-50 text-green-700 dark:border-green-300 dark:bg-green-950 dark:text-green-300",
  FAILED: "border-destructive bg-destructive/15 text-destructive",
  REJECTED: "border-destructive bg-destructive/15 text-destructive",
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
