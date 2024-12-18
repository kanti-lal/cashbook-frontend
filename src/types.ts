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
  businessId?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phoneNumber: string;
  balance: number;
  businessId?: string;
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
  businessId?: string;
  paymentMode: "CASH" | "ONLINE";
}

export interface MonthlyAnalytics {
  month: string;
  totalIn: number;
  totalOut: number;
  balance: number;
}
