import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Business, Customer, Supplier, Transaction } from "../api/types";
import { businessesApi } from "../api/businesses";
import { customersApi } from "../api/customers";
import { suppliersApi } from "../api/suppliers";
import { transactionsApi } from "../api/transactions";
import { useAuth } from "./AuthContext";

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
  activeBusiness: Business | null;
  setActiveBusiness: (business: Business | null) => void;
  businesses: Business[];
  customers: Customer[];
  suppliers: Supplier[];
  transactions: Transaction[];
  isLoading: boolean;
  createBusiness: (business: Business) => Promise<Business>;
  createCustomer: (customer: Omit<Customer, "id">) => Promise<Customer>;
  createSupplier: (supplier: Omit<Supplier, "id">) => Promise<Supplier>;
  createTransaction: (
    transaction: Omit<Transaction, "id">
  ) => Promise<Transaction>;
  refreshBusinesses: () => void;
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
      staleTime: Infinity,
      enabled: !!activeBusiness?.id,
    });

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

  const createSupplierMutation = useMutation({
    mutationFn: (supplier: Omit<Supplier, "id">) =>
      suppliersApi.create(activeBusiness!.id, supplier),
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
      queryClient.invalidateQueries({
        queryKey: ["transactions", activeBusiness?.id],
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
        createBusiness: createBusinessMutation.mutateAsync,
        createCustomer: createCustomerMutation.mutateAsync,
        createSupplier: createSupplierMutation.mutateAsync,
        createTransaction: createTransactionMutation.mutateAsync,
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
