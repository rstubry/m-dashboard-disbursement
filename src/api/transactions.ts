import { apiClient } from "@/api/axios";
import type {
  Transaction,
  TransactionListParams,
  TransactionListResponse,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from "@/models/transaction";

export const getTransactions = async (
  params: TransactionListParams,
): Promise<TransactionListResponse> => {
  const response = await apiClient.get<Transaction[]>("/transactions", {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.status && { status: params.status }),
      ...(params.search && { search: params.search }),
    },
  });
  return {
    data: response.data,
    total: Number(response.headers["x-total-count"] ?? 0),
  };
};

export const createTransaction = (payload: CreateTransactionPayload) =>
  apiClient.post<Transaction>("/transactions", payload);

export const updateTransaction = (id: string, payload: UpdateTransactionPayload) =>
  apiClient.put<Transaction>(`/transactions/${id}`, payload);
