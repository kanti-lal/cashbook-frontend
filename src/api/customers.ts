import { apiClient } from "./client";
import { Customer } from "./types";

export const customersApi = {
  getAll: async (businessId: string, search?: string) => {
    const { data } = await apiClient.get<Customer[]>(
      `/businesses/${businessId}/customers`,
      {
        params: { search },
      }
    );
    return data;
  },

  create: async (businessId: string, customer: Omit<Customer, "id">) => {
    const { data } = await apiClient.post<Customer>(
      `/businesses/${businessId}/customers`,
      customer
    );
    return data;
  },

  update: async (
    businessId: string,
    customerId: string,
    customer: Partial<Customer>
  ) => {
    const { data } = await apiClient.put<Customer>(
      `/businesses/${businessId}/customers/${customerId}`,
      customer
    );
    return data;
  },

  delete: async (businessId: string, customerId: string) => {
    await apiClient.delete(`/businesses/${businessId}/customers/${customerId}`);
  },
};
