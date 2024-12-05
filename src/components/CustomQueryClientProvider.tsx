import React, { ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryClientProviderProps,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a new instance of QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Number of retry attempts for failed queries
      refetchOnWindowFocus: false, // Disable refetch on window focus
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    },
  },
});

interface CustomQueryClientProviderProps {
  children: ReactNode;
}

const CustomQueryClientProvider: React.FC<CustomQueryClientProviderProps> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Add React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default CustomQueryClientProvider;
