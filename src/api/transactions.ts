// api/transactions.ts
import { apiClient } from "./client";
import { Transaction } from "./types";

export const transactionsApi = {
  getAll: async (
    businessId: string,
    params?: { startDate?: string; endDate?: string }
  ) => {
    const { data } = await apiClient.get<Transaction[]>(
      `/businesses/${businessId}/transactions`,
      { params }
    );
    return data;
  },

  create: async (businessId: string, transaction: Omit<Transaction, "id">) => {
    const { data } = await apiClient.post<Transaction>(
      `/businesses/${businessId}/transactions`,
      transaction
    );
    return data;
  },

  delete: async (businessId: string, transactionId: string) => {
    await apiClient.delete(
      `/businesses/${businessId}/transactions/${transactionId}`
    );
  },
};
