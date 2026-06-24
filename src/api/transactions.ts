import { apiClient } from "@/api/axios";
import type {
  Transaction,
  TransactionListParams,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from "@/models/transaction";

export const getTransactions = (params: TransactionListParams) =>
  apiClient.get<Transaction[]>("/transactions", {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.status && { status: params.status }),
      ...(params.search && { search: params.search }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.order && { order: params.order }),
    },
  });

export const getTransactionCount = (params: Pick<TransactionListParams, "status" | "search" | "sortBy" | "order">) =>
  apiClient.get<Transaction[]>("/transactions", {
    params: {
      ...(params.status && { status: params.status }),
      ...(params.search && { search: params.search }),
    },
  });

export const createTransaction = (payload: CreateTransactionPayload) =>
  apiClient.post<Transaction>("/transactions", payload);

export const updateTransaction = (id: string, payload: UpdateTransactionPayload) =>
  apiClient.put<Transaction>(`/transactions/${id}`, payload);
