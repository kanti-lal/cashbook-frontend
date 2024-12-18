// api/suppliers.ts
import { apiClient } from "./client";
import { Supplier } from "./types";

export const suppliersApi = {
  getAll: async (businessId: string, search?: string) => {
    try {
      const { data } = await apiClient.get<Supplier[]>(
        `/businesses/${businessId}/suppliers`,
        { params: { search } }
      );
      return data;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw error;
    }
  },

  getById: async (businessId: string, supplierId: string) => {
    try {
      const { data } = await apiClient.get<Supplier>(
        `/businesses/${businessId}/suppliers/${supplierId}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  },

  create: async (businessId: string, supplier: Omit<Supplier, "id">) => {
    try {
      const { data } = await apiClient.post<Supplier>(
        `/businesses/${businessId}/suppliers`,
        supplier
      );
      return data;
    } catch (error) {
      console.error("Error creating supplier:", error);
      throw error;
    }
  },

  update: async (
    businessId: string,
    supplierId: string,
    supplier: Partial<Supplier>
  ) => {
    try {
      const { data } = await apiClient.put<Supplier>(
        `/businesses/${businessId}/suppliers/${supplierId}`,
        supplier
      );
      return data;
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  },

  delete: async (businessId: string, supplierId: string) => {
    try {
      await apiClient.delete(
        `/businesses/${businessId}/suppliers/${supplierId}`
      );
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw error;
    }
  },
};
