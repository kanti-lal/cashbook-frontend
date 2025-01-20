import { apiClient } from "./client";

// Response Types
interface LoginResponse {
  token: string;
  user: UserProfile;
}

interface RegisterResponse {
  message: string;
  user: {
    token: string;
    user: UserProfile;
  };
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  mobile?: string;
  address?: string;
  dateOfBirth?: string;
}

interface MessageResponse {
  message: string;
}

// Request Types
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  mobile?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface UpdateProfileData {
  name: string;
  mobile?: string;
  address?: string;
  dateOfBirth?: string;
  email?: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
}

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// API Client
export const authApi = {
  // Login
  login: async (data: LoginData) => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    // Store the token in localStorage
    localStorage.setItem("auth_token", response?.data?.token);
    return response.data.user;
  },

  // Register
  register: async (data: RegisterData) => {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      data
    );
    // Store the token in localStorage
    localStorage.setItem("auth_token", response?.data?.user?.token);
    return response.data;
  },

  // Get Current User Profile
  getProfile: async () => {
    const response = await apiClient.get<UserProfile>("/auth/me");
    return response.data;
  },

  // Update Profile
  updateProfile: async (data: UpdateProfileData) => {
    const response = await apiClient.put<UserProfile>("/auth/profile", data);
    return response.data;
  },

  // Request Password Reset
  forgotPassword: async (email: any) => {
    try {
      const { data } = await apiClient.post("/auth/forgot-password", { email });
      return data;
    } catch (error) {
      console.error("Error sending reset password email:", error);
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (token: any, password: any) => {
    try {
      const { data } = await apiClient.post("/auth/reset-password", {
        token,
        password,
      });
      return data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },

  // Update Password
  updatePassword: async (data: UpdatePasswordData) => {
    const response = await apiClient.post<MessageResponse>(
      "/auth/update-password",
      data
    );
    return response.data;
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("activeBusiness");
    // localStorage.clear();
  },
};

// Export types for use in other files
export type {
  LoginResponse,
  UserProfile,
  MessageResponse,
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  UpdatePasswordData,
};
