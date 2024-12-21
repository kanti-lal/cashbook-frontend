import { createContext, useContext, ReactNode, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Business, Customer, Supplier, Transaction } from "../api/types";
import { businessesApi } from "../api/businesses";
import { customersApi } from "../api/customers";
import { suppliersApi } from "../api/suppliers";
import { transactionsApi } from "../api/transactions";
import { useAuth } from "./AuthContext";
import { MonthlyAnalytics } from "../types";

// Local storage utility functions
const ACTIVE_BUSINESS_KEY = "activeBusiness";

export const localStorageUtils = {
  getActiveBusiness: (): Business | null => {
    const storedBusiness = localStorage.getItem(ACTIVE_BUSINESS_KEY);
    return storedBusiness ? JSON.parse(storedBusiness) : null;
  },

  setActiveBusiness: (business: Business | null) => {
    if (business) {
      localStorage.setItem(ACTIVE_BUSINESS_KEY, JSON.stringify(business));
    } else {
      localStorage.removeItem(ACTIVE_BUSINESS_KEY);
    }
  },
};

interface BusinessContextType {
  // State
  activeBusiness: Business | null;
  businesses: Business[];
  customers: Customer[];
  suppliers: Supplier[];
  transactions: Transaction[];
  isLoading: boolean;

  // Business methods
  setActiveBusiness: (business: Business | null) => void;
  createBusiness: (business: Omit<Business, "id">) => Promise<Business>;
  refreshBusinesses: () => void;

  // Customer methods
  getCustomerById: (customerId: string | undefined) => {
    data: Customer | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  // Supplier methods
  getSupplierById: (supplierId: string | undefined) => {
    data: Supplier | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  createCustomer: (customer: Omit<Customer, "id">) => Promise<Customer>;

  updateCustomer: (params: {
    customerId: string;
    data: Partial<Customer>;
  }) => Promise<Customer>;

  deleteCustomer: (customerId: string, businessId: string) => Promise<void>;

  // Supplier methods
  createSupplier: (supplier: Omit<Supplier, "id">) => Promise<Supplier>;

  updateSupplier: (params: {
    supplierId: string;
    data: Partial<Supplier>;
  }) => Promise<Supplier>;

  deleteSupplier: (supplierId: string, businessId: string) => Promise<void>;

  // Transaction methods
  createTransaction: (
    transaction: Omit<Transaction, "id">
  ) => Promise<Transaction>;
  updateTransaction: (params: {
    transactionId: string;
    data: Partial<Transaction>;
  }) => Promise<Transaction>;

  deleteTransaction: (transactionId: string) => Promise<void>;

  // Add these new methods
  getCustomerTransactions: (customerId: string | undefined) => {
    data: Transaction[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  getSupplierTransactions: (supplierId: string | undefined) => {
    data: Transaction[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  getBusinessAnalytics: () => {
    data: MonthlyAnalytics[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  // Initialize active business from localStorage
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(
    localStorageUtils.getActiveBusiness()
  );

  // Queries
  const {
    data: businesses = [],
    isLoading: isLoadingBusinesses,
    refetch: refetchBusinesses,
  } = useQuery({
    queryKey: ["businesses"],
    queryFn: businessesApi.getAll,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2, // Retry failed fetches
  });

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", activeBusiness?.id],
    queryFn: () => customersApi.getAll(activeBusiness!.id),
    enabled: !!activeBusiness?.id,
  });

  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ["suppliers", activeBusiness?.id],
    queryFn: () => suppliersApi.getAll(activeBusiness!.id),
    enabled: !!activeBusiness?.id,
  });

  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useQuery({
      queryKey: ["transactions", activeBusiness?.id],
      queryFn: () => transactionsApi.getAll(activeBusiness!.id),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      enabled: !!activeBusiness?.id,
    });

  const getCustomerById = (customerId: string | undefined) => {
    const query = useQuery({
      queryKey: ["customer", activeBusiness?.id, customerId],
      queryFn: () => customersApi.getById(activeBusiness!.id, customerId!),
      enabled: !!activeBusiness?.id && !!customerId,
      staleTime: 0,
      gcTime: 0,
    });

    return query;
  };
  const getSupplierById = (supplierId: string | undefined) => {
    const query = useQuery({
      queryKey: ["supplier", activeBusiness?.id, supplierId],
      queryFn: () => suppliersApi.getById(activeBusiness!.id, supplierId!),
      enabled: !!activeBusiness?.id && !!supplierId,
      staleTime: 0,
      gcTime: 0,
    });

    return query;
  };

  const getCustomerTransactions = (customerId: string | undefined) => {
    const query = useQuery({
      queryKey: ["customerTransactions", activeBusiness?.id, customerId],
      queryFn: () =>
        transactionsApi.getTransactionsByCustomerId(
          activeBusiness!.id,
          customerId!
        ),
      enabled: !!activeBusiness?.id && !!customerId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });

    return query;
  };

  const getSupplierTransactions = (supplierId: string | undefined) => {
    const query = useQuery({
      queryKey: ["supplierTransactions", activeBusiness?.id, supplierId],
      queryFn: () =>
        transactionsApi.getTransactionsBySupplierId(
          activeBusiness!.id,
          supplierId!
        ),
      enabled: !!activeBusiness?.id && !!supplierId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });

    return query;
  };

  const getBusinessAnalytics = () => {
    const query = useQuery({
      queryKey: ["businessAnalytics", activeBusiness?.id],
      queryFn: () => transactionsApi.getBusinessAnalytics(activeBusiness!.id),
      enabled: !!activeBusiness?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });

    return query;
  };

  // Custom setActiveBusiness to update localStorage
  const handleSetActiveBusiness = (business: Business | null) => {
    setActiveBusiness(business);
    localStorageUtils.setActiveBusiness(business);
  };

  // Mutations

  const createBusinessMutation = useMutation({
    mutationFn: businessesApi.create,
    onSuccess: (newBusiness) => {
      // Update localStorage when creating a business
      localStorageUtils.setActiveBusiness(newBusiness);
      // Force refetch businesses
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      // Set active business
      handleSetActiveBusiness(newBusiness);
      return newBusiness;
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: (customer: Omit<Customer, "id">) =>
      customersApi.create(activeBusiness!.id, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", activeBusiness?.id],
      });
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: string;
      data: Partial<Customer>;
    }) => customersApi.update(activeBusiness!.id, customerId, data as Customer),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customer", activeBusiness?.id, variables.customerId],
      });
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (customerId: string) =>
      customersApi.delete(activeBusiness!.id, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", activeBusiness?.id],
      });
    },
  });

  const createSupplierMutation = useMutation({
    mutationFn: (supplier: Omit<Supplier, "id">) =>
      suppliersApi.create(activeBusiness!.id, supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", activeBusiness?.id],
      });
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: ({
      supplierId,
      data,
    }: {
      supplierId: string;
      data: Partial<Supplier>;
    }) => suppliersApi.update(activeBusiness!.id, supplierId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", activeBusiness?.id],
      });
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: (supplierId: string) =>
      suppliersApi.delete(activeBusiness!.id, supplierId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", activeBusiness?.id],
      });
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: (transaction: Omit<Transaction, "id">) =>
      transactionsApi.create(activeBusiness!.id, transaction),
    onSuccess: () => {
      // Invalidate both transactions and the related entity (customer/supplier)
      queryClient.invalidateQueries({
        queryKey: ["transactions", activeBusiness?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["customers", activeBusiness?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["suppliers", activeBusiness?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["supplierTransactions", activeBusiness?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["customerTransactions", activeBusiness?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["customer", activeBusiness?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["supplier", activeBusiness?.id],
      });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({
      transactionId,
      data,
    }: {
      transactionId: string;
      data: Partial<Transaction>;
    }) => transactionsApi.update(activeBusiness!.id, transactionId, data),
    onSuccess: () => {
      // Invalidate both transactions and related entities
      queryClient.invalidateQueries({
        queryKey: ["transactions", activeBusiness?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["customers", activeBusiness?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["suppliers", activeBusiness?.id],
      });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (transactionId: string) =>
      transactionsApi.delete(activeBusiness!.id, transactionId),
    onSuccess: () => {
      // Invalidate both transactions and related entities
      queryClient.invalidateQueries({
        queryKey: ["transactions", activeBusiness?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["customers", activeBusiness?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["suppliers", activeBusiness?.id],
      });
    },
  });

  const refreshBusinesses = () => {
    refetchBusinesses();
  };

  const isLoading =
    isLoadingBusinesses ||
    isLoadingCustomers ||
    isLoadingSuppliers ||
    isLoadingTransactions;

  return (
    <BusinessContext.Provider
      value={{
        activeBusiness,
        setActiveBusiness: handleSetActiveBusiness,
        businesses,
        customers,
        suppliers,
        transactions,
        isLoading,
        createBusiness: (business: Omit<Business, "id">) =>
          createBusinessMutation.mutateAsync(business as Business),
        createCustomer: createCustomerMutation.mutateAsync,
        updateCustomer: updateCustomerMutation.mutateAsync,
        deleteCustomer: (customerId: string, businessId: string) =>
          deleteCustomerMutation.mutateAsync(customerId),
        createSupplier: createSupplierMutation.mutateAsync,
        updateSupplier: updateSupplierMutation.mutateAsync,
        deleteSupplier: (supplierId: string) =>
          deleteSupplierMutation.mutateAsync(supplierId),
        createTransaction: createTransactionMutation.mutateAsync,
        updateTransaction: updateTransactionMutation.mutateAsync,
        deleteTransaction: deleteTransactionMutation.mutateAsync,
        getCustomerById,
        getSupplierById,
        getCustomerTransactions,
        getSupplierTransactions,
        getBusinessAnalytics,
        refreshBusinesses,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
