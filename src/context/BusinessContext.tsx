// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { Business } from '../types';
// import { getActiveBusiness, setActiveBusiness as saveActiveBusiness } from '../utils/storage';

// interface BusinessContextType {
//   activeBusiness: Business | null;
//   setActiveBusiness: (business: Business) => void;
//   refreshBusinesses: () => void;
//   refreshCustomers: () => void;
//   refreshSuppliers: () => void;
// }

// const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

// export function BusinessProvider({ children }: { children: ReactNode }) {
//   const [activeBusiness, setActiveBusinessState] = useState<Business | null>(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [customerRefreshTrigger, setCustomerRefreshTrigger] = useState(0);
//   const [supplierRefreshTrigger, setSupplierRefreshTrigger] = useState(0);

//   useEffect(() => {
//     const storedBusiness = getActiveBusiness();
//     if (storedBusiness) {
//       setActiveBusinessState(storedBusiness);
//     }
//   }, [refreshTrigger]);

//   const handleSetActiveBusiness = (business: Business) => {
//     saveActiveBusiness(business);
//     setActiveBusinessState(business);
//   };

//   const refreshBusinesses = () => {
//     setRefreshTrigger(prev => prev + 1);
//   };

//   const refreshCustomers = () => {
//     setCustomerRefreshTrigger(prev => prev + 1);
//   };

//   const refreshSuppliers = () => {
//     setSupplierRefreshTrigger(prev => prev + 1);
//   };

//   return (
//     <BusinessContext.Provider
//       value={{
//         activeBusiness,
//         setActiveBusiness: handleSetActiveBusiness,
//         refreshBusinesses,
//         refreshCustomers,
//         refreshSuppliers,
//       }}
//     >
//       {children}
//     </BusinessContext.Provider>
//   );
// }

// export function useBusiness() {
//   const context = useContext(BusinessContext);
//   if (context === undefined) {
//     throw new Error('useBusiness must be used within a BusinessProvider');
//   }
//   return context;
// }

// context/BusinessContext.tsx

// import { createContext, useContext, ReactNode, useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Business, Customer, Supplier, Transaction } from "../api/types";
// import { businessesApi } from "../api/businesses";
// import { customersApi } from "../api/customers";
// import { suppliersApi } from "../api/suppliers";
// import { transactionsApi } from "../api/transactions";

// interface BusinessContextType {
//   activeBusiness: Business | null;
//   setActiveBusiness: (business: Business | null) => void;
//   businesses: Business[];
//   customers: Customer[];
//   suppliers: Supplier[];
//   transactions: Transaction[];
//   isLoading: boolean;
//   createBusiness: (business: Business) => Promise<Business>;
//   createCustomer: (customer: Omit<Customer, "id">) => Promise<Customer>;
//   createSupplier: (supplier: Omit<Supplier, "id">) => Promise<Supplier>;
//   createTransaction: (
//     transaction: Omit<Transaction, "id">
//   ) => Promise<Transaction>;
// }

// const BusinessContext = createContext<BusinessContextType | undefined>(
//   undefined
// );

// export function BusinessProvider({ children }: { children: ReactNode }) {
//   const queryClient = useQueryClient();

//   // Store active business in state
//   const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);

//   // Queries
//   const { data: businesses = [], isLoading: isLoadingBusinesses } = useQuery({
//     queryKey: ["businesses"],
//     queryFn: businessesApi.getAll,
//   });

//   const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
//     queryKey: ["customers", activeBusiness?.id],
//     queryFn: () => customersApi.getAll(activeBusiness!.id),
//     enabled: !!activeBusiness,
//   });

//   const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery({
//     queryKey: ["suppliers", activeBusiness?.id],
//     queryFn: () => suppliersApi.getAll(activeBusiness!.id),
//     enabled: !!activeBusiness,
//   });

//   const { data: transactions = [], isLoading: isLoadingTransactions } =
//     useQuery({
//       queryKey: ["transactions", activeBusiness?.id],
//       queryFn: () => transactionsApi.getAll(activeBusiness!.id),
//       enabled: !!activeBusiness,
//     });

//   // Mutations
//   const createBusinessMutation = useMutation({
//     mutationFn: businessesApi.create,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["businesses"] });
//     },
//   });

//   const createCustomerMutation = useMutation({
//     mutationFn: (customer: Omit<Customer, "id">) =>
//       customersApi.create(activeBusiness!.id, customer),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["customers", activeBusiness?.id],
//       });
//     },
//   });

//   const createSupplierMutation = useMutation({
//     mutationFn: (supplier: Omit<Supplier, "id">) =>
//       suppliersApi.create(activeBusiness!.id, supplier),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["suppliers", activeBusiness?.id],
//       });
//     },
//   });

//   const createTransactionMutation = useMutation({
//     mutationFn: (transaction: Omit<Transaction, "id">) =>
//       transactionsApi.create(activeBusiness!.id, transaction),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["transactions", activeBusiness?.id],
//       });
//     },
//   });

//   const isLoading =
//     isLoadingBusinesses ||
//     isLoadingCustomers ||
//     isLoadingSuppliers ||
//     isLoadingTransactions;

//   return (
//     <BusinessContext.Provider
//       value={{
//         activeBusiness,
//         setActiveBusiness,
//         businesses,
//         customers,
//         suppliers,
//         transactions,
//         isLoading,
//         createBusiness: createBusinessMutation.mutateAsync,
//         createCustomer: createCustomerMutation.mutateAsync,
//         createSupplier: createSupplierMutation.mutateAsync,
//         createTransaction: createTransactionMutation.mutateAsync,
//       }}
//     >
//       {children}
//     </BusinessContext.Provider>
//   );
// }

// export function useBusiness() {
//   const context = useContext(BusinessContext);
//   if (context === undefined) {
//     throw new Error("useBusiness must be used within a BusinessProvider");
//   }
//   return context;
// }

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
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Initialize active business from localStorage
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(
    localStorageUtils.getActiveBusiness()
  );

  // Queries
  const { data: businesses = [], isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: businessesApi.getAll,
  });

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", activeBusiness?.id],
    queryFn: () => customersApi.getAll(activeBusiness!.id),
    enabled: !!activeBusiness,
  });

  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ["suppliers", activeBusiness?.id],
    queryFn: () => suppliersApi.getAll(activeBusiness!.id),
    enabled: !!activeBusiness,
  });

  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useQuery({
      queryKey: ["transactions", activeBusiness?.id],
      queryFn: () => transactionsApi.getAll(activeBusiness!.id),
      enabled: !!activeBusiness,
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
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
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
