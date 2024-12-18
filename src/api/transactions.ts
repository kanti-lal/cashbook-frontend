// api/transactions.ts
import { apiClient } from "./client";
import { Transaction } from "./types";

interface TransactionFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  type?: "IN" | "OUT";
  category?: "CUSTOMER" | "SUPPLIER";
  paymentMode?: "CASH" | "ONLINE";
}

interface MonthlyAnalytics {
  month: string; // Format: "YYYY-MM"
  cash: {
    totalIn: number;
    totalOut: number;
  };
  online: {
    totalIn: number;
    totalOut: number;
  };
  totalIn: number; // Sum of cash.totalIn + online.totalIn
  totalOut: number; // Sum of cash.totalOut + online.totalOut
  balance: number; // Difference between totalIn and totalOut
}

export const transactionsApi = {
  getAll: async (businessId: string, filters?: TransactionFilters) => {
    try {
      const { data } = await apiClient.get<Transaction[]>(
        `/businesses/${businessId}/transactions`,
        { params: filters }
      );
      return data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  getById: async (businessId: string, transactionId: string) => {
    const { data } = await apiClient.get<Transaction>(
      `/businesses/${businessId}/transactions/${transactionId}`
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

  update: async (
    businessId: string,
    transactionId: string,
    transaction: Partial<Transaction>
  ) => {
    const { data } = await apiClient.put<Transaction>(
      `/businesses/${businessId}/transactions/${transactionId}`,
      transaction
    );
    return data;
  },

  delete: async (businessId: string, transactionId: string) => {
    await apiClient.delete(
      `/businesses/${businessId}/transactions/${transactionId}`
    );
  },

  getTransactionsByCustomerId: async (
    businessId: string,
    customerId: string
  ) => {
    try {
      const { data } = await apiClient.get<Transaction[]>(
        `/businesses/${businessId}/customer-transactions/${customerId}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching customer transactions:", error);
      throw error;
    }
  },

  getTransactionsBySupplierId: async (
    businessId: string,
    supplierId: string
  ) => {
    try {
      const { data } = await apiClient.get<Transaction[]>(
        `/businesses/${businessId}/supplier-transactions/${supplierId}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching supplier transactions:", error);
      throw error;
    }
  },

  getBusinessAnalytics: async (
    businessId: string
  ): Promise<MonthlyAnalytics[]> => {
    try {
      const { data } = await apiClient.get<MonthlyAnalytics[]>(
        `/businesses/${businessId}/analytics`
      );
      return data;
    } catch (error) {
      console.error("Error fetching business analytics:", error);
      throw error;
    }
  },
};
