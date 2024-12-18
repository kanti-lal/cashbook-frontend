// api/types.ts
export interface Business {
  id: string;
  name: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  balance: number;
}

export interface Supplier {
  id: string;
  name: string;
  phoneNumber: string;
  balance: number;
}

export interface Transaction {
  id: string;
  type: "IN" | "OUT";
  amount: number;
  customerId?: string;
  supplierId?: string;
  description: string;
  date: string;
  category: "CUSTOMER" | "SUPPLIER";
  paymentMode: "CASH" | "ONLINE";
}
