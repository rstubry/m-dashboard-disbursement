"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
} from "@/api/transactions";
import type {
  TransactionListParams,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from "@/models/transaction";

export const TRANSACTIONS_KEY = "transactions";

export const useGetTransactions = (params: TransactionListParams) =>
  useQuery({
    queryKey: [TRANSACTIONS_KEY, params],
    queryFn: () => getTransactions(params),
  });

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
      updateTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
};
