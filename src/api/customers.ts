import { apiClient } from "./client";
import { Customer } from "./types";

export const customersApi = {
  getAll: async (businessId: string, search?: string) => {
    try {
      const { data } = await apiClient.get<Customer[]>(
        `/businesses/${businessId}/customers`,
        { params: { search } }
      );
      return data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  getById: async (businessId: string, customerId: string) => {
    try {
      const { data } = await apiClient.get<Customer>(
        `/businesses/${businessId}/customers/${customerId}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  },

  create: async (businessId: string, customer: Omit<Customer, "id">) => {
    try {
      const { data } = await apiClient.post<Customer>(
        `/businesses/${businessId}/customers`,
        customer
      );
      return data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  update: async (
    businessId: string,
    customerId: string,
    customer: Omit<Customer, "id">
  ) => {
    try {
      const { data } = await apiClient.put<Customer>(
        `/businesses/${businessId}/customers/${customerId}`,
        customer
      );
      return data;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  },

  delete: async (businessId: string, customerId: string) => {
    try {
      await apiClient.delete(
        `/businesses/${businessId}/customers/${customerId}`
      );
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  },
};
