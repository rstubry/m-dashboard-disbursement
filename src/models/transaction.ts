export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "APPROVED" | "REJECTED";

export type Bank =
  | "BCA"
  | "BRI"
  | "BNI"
  | "Mandiri"
  | "BSI"
  | "CIMB Niaga"
  | "Permata"
  | "Danamon"
  | "BTN";

export type Transaction = {
  id: string;
  sender_name: string;
  account_number: string;
  bank: Bank;
  amount: number;
  admin_fee: number;
  status: TransactionStatus;
  note: string;
  created_at: string;
};

export type CreateTransactionPayload = Omit<Transaction, "id" | "created_at">;

export type UpdateTransactionPayload = {
  status: "APPROVED" | "REJECTED";
};

export type TransactionListParams = {
  page: number;
  limit: number;
  status?: TransactionStatus;
  search?: string;
};

export type TransactionListResponse = {
  data: Transaction[];
  total: number;
};
