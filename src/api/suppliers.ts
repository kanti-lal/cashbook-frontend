// api/suppliers.ts
import { apiClient } from "./client";
import { Supplier } from "./types";

export const suppliersApi = {
  getAll: async (businessId: string, search?: string) => {
    const { data } = await apiClient.get<Supplier[]>(
      `/businesses/${businessId}/suppliers`,
      {
        params: { search },
      }
    );
    return data;
  },

  create: async (businessId: string, supplier: Omit<Supplier, "id">) => {
    const { data } = await apiClient.post<Supplier>(
      `/businesses/${businessId}/suppliers`,
      supplier
    );
    return data;
  },

  update: async (
    businessId: string,
    supplierId: string,
    supplier: Partial<Supplier>
  ) => {
    const { data } = await apiClient.put<Supplier>(
      `/businesses/${businessId}/suppliers/${supplierId}`,
      supplier
    );
    return data;
  },

  delete: async (businessId: string, supplierId: string) => {
    await apiClient.delete(`/businesses/${businessId}/suppliers/${supplierId}`);
  },
};
