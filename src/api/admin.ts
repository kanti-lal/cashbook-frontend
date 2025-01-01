import { apiClient } from "./client";

const ADMIN_TOKEN_KEY = "admin_token";

export const adminApi = {
  getAllUsers: async () => {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const { data } = await apiClient.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  blockUser: async (userId: number) => {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const { data } = await apiClient.post(
        `/admin/users/${userId}/block`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (error) {
      console.error("Error blocking user:", error);
      throw error;
    }
  },

  unblockUser: async (userId: number) => {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const { data } = await apiClient.post(
        `/admin/users/${userId}/unblock`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (error) {
      console.error("Error unblocking user:", error);
      throw error;
    }
  },

  deleteUser: async (userId: number) => {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const { data } = await apiClient.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};
