"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  getTransactionCount,
  createTransaction,
  updateTransaction,
} from "@/api/transactions";
import type {
  Transaction,
  TransactionListParams,
  TransactionListResponse,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from "@/models/transaction";

export const TRANSACTIONS_KEY = "transactions";
export const TRANSACTIONS_COUNT_KEY = "transactions-count";

export const useGetTransactions = (params: TransactionListParams) => {
  const filters = {
    status: params.status,
    search: params.search,
  };

  const dataQuery = useQuery({
    queryKey: [TRANSACTIONS_KEY, params],
    queryFn: async () => {
      const res = await getTransactions(params);
      return res.data as Transaction[];
    },
  });

  const countQuery = useQuery({
    queryKey: [TRANSACTIONS_COUNT_KEY, filters],
    queryFn: async () => {
      const headerTotal = dataQuery.data
        ? Number((await getTransactionCount(filters)).headers["x-total-count"])
        : NaN;
      if (!isNaN(headerTotal)) return headerTotal;
      const res = await getTransactionCount(filters);
      return res.data.length;
    },
    enabled: dataQuery.isSuccess,
  });

  const result: TransactionListResponse = {
    data: dataQuery.data ?? [],
    total: countQuery.data ?? 0,
  };

  return {
    data: result,
    isLoading: dataQuery.isLoading,
    isError: dataQuery.isError,
  };
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_COUNT_KEY] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTransactionPayload;
    }) => updateTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
};
