import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

interface AdminUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

interface AdminContextType {
  admin: AdminUser | null;
  isAdminLoading: boolean;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
}

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

const AdminContext = createContext<AdminContextType>({
  admin: null,
  isAdminLoading: false,
  isAdminAuthenticated: false,
  adminLogin: async () => {
    throw new Error("AdminContext not initialized");
  },
  adminLogout: () => {
    throw new Error("AdminContext not initialized");
  },
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const storedAdmin = localStorage.getItem(ADMIN_USER_KEY);
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    return !!token;
  });

  const adminLoginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      try {
        const { data } = await apiClient.post("/admin/login", {
          email,
          password,
        });
        return data;
      } catch (error) {
        console.error("Admin login failed:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setAdmin(data.user);
      setIsAdminAuthenticated(true);
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
    },
  });

  const adminLogin = async (email: string, password: string) => {
    setIsAdminLoading(true);
    try {
      await adminLoginMutation.mutateAsync({ email, password });
    } finally {
      setIsAdminLoading(false);
    }
  };

  const adminLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    queryClient.clear();
    setAdmin(null);
    setIsAdminAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      admin,
      isAdminLoading,
      isAdminAuthenticated,
      adminLogin,
      adminLogout,
    }),
    [admin, isAdminLoading, isAdminAuthenticated, adminLogin]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
