import {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, RegisterData, UpdateProfileData } from "../api/auth";
import axios, { AxiosError, AxiosResponse } from "axios";

const USER_KEY = "auth_user";
// const ACTIVE_BUSINESS_KEY = "activeBusiness";
const AUTH_TOKEN_KEY = "auth_token";

interface User {
  id: number;
  email: string;
  name: string;
  mobile?: string;
  address?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("auth_token");
    return !!token;
  });

  // Add this function to check token validity
  const checkAuthStatus = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      queryClient.clear();
      return false;
    }
    return true;
  };

  // Modify useEffect to use the check function
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Add interceptor to handle 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (user: any) => {
      setUser(user?.user);
      setIsAuthenticated(true);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (user) => {
      setUser(user);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      queryClient.setQueryData(["user"], user);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: authApi.updatePassword,
  });

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({ email, password });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    await registerMutation.mutateAsync(data);
    setIsLoading(false);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setIsLoading(true);
    await updateProfileMutation.mutateAsync(data);
    setIsLoading(false);
  };

  const forgotPassword = async (email: string) => {
    await forgotPasswordMutation.mutateAsync(email);
  };

  const resetPassword = async (token: string, password: string) => {
    await resetPasswordMutation.mutateAsync({ token, password });
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    await updatePasswordMutation.mutateAsync({ currentPassword, newPassword });
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem(USER_KEY);
    // localStorage.removeItem(ACTIVE_BUSINESS_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    // queryClient.removeQueries({ queryKey: ["user"] });
    localStorage.removeItem("activeBusiness");

    queryClient.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      register,
      updateProfile,
      forgotPassword,
      resetPassword,
      updatePassword,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      register,
      updateProfile,
      forgotPassword,
      resetPassword,
      updatePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
