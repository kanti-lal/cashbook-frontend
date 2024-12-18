// import { Business } from "../types";
// import { apiClient } from "./client";

// export const businessesApi = {
//   getAll: async () => {
//     const { data } = await apiClient.get<Business[]>("/businesses");
//     return data;
//   },

//   create: async (business: Omit<Business, "id">) => {
//     const { data } = await apiClient.post<Business>("/businesses", business);
//     return data;
//   },
// };

import axios from "axios";
import { Business } from "../types";
import { apiClient } from "./client";

export const businessesApi = {
  getAll: async () => {
    try {
      // Verify token exists before making request
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const { data } = await apiClient.get<Business[]>("/businesses");
      return data;
    } catch (error) {
      console.error("Error fetching businesses:", error);

      // Log specific error details
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Response data:", error.response?.data);

        // Handle specific status codes
        if (error.response?.status === 403) {
          console.error("Access forbidden - Please check your permissions");
        }
      }

      throw error;
    }
  },

  create: async (business: Business) => {
    try {
      // Ensure all required fields are present
      const completeBusinessData = {
        ...business,
        id: business.id || crypto.randomUUID(), // Generate ID if not provided
        createdAt: business.createdAt || new Date().toISOString(),
      };

      const { data } = await apiClient.post<Business>(
        "/businesses",
        completeBusinessData
      );
      return data;
    } catch (error) {
      console.error("Error creating business:", error);

      // If using axios, you can get more details about the error
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        if (error.response?.status === 403) {
          console.error("Access forbidden - Please check your permissions");
        }
      }

      throw error;
    }
  },
};
