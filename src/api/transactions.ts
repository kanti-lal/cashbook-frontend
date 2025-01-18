// api/transactions.ts
import { downloadPDF } from "../utils/pdfDownloader";
import { apiClient } from "./client";
import { Transaction } from "./types";
import { format } from "date-fns";

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

  exportTransactionsPDF: async (businessId: string) => {
    try {
      const response = await apiClient.get(
        `/businesses/${businessId}/export-transactions`,
        {
          responseType: "arraybuffer",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      return downloadPDF(
        response,
        `transactions-${format(new Date(), "yyyy-MM-dd")}.pdf`
      );
    } catch (error) {
      console.error("Export PDF Error:", error);
      throw error;
    }
  },

  exportCustomerLedgerPDF: async (businessId: string, customerId: string) => {
    try {
      const response = await apiClient.get(
        `/businesses/${businessId}/export-customer-ledger/${customerId}`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!response.data) {
        throw new Error("Failed to generate PDF");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `customer-ledger-${customerId}-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  },

  exportSupplierLedgerPDF: async (businessId: string, supplierId: string) => {
    try {
      const response = await apiClient.get(
        `/businesses/${businessId}/export-supplier-ledger/${supplierId}`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!response.data) {
        throw new Error("Failed to generate PDF");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `supplier-ledger-${supplierId}-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  },

  exportAllCustomersLedgerPDF: async (businessId: string) => {
    try {
      const response = await apiClient.get(
        `/businesses/${businessId}/export-all-customers-ledger`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      return downloadPDF(
        response,
        `all-customers-ledger-${format(new Date(), "yyyy-MM-dd")}.pdf`
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  },

  exportAllSuppliersLedgerPDF: async (businessId: string) => {
    try {
      const response = await apiClient.get(
        `/businesses/${businessId}/export-all-suppliers-ledger`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      return downloadPDF(
        response,
        `all-suppliers-ledger-${format(new Date(), "yyyy-MM-dd")}.pdf`
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  },
};
