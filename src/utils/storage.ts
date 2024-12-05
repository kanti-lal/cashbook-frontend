import { Business, Customer, Supplier, Transaction, MonthlyAnalytics } from '../types';
import { format, startOfMonth } from 'date-fns';

const BUSINESSES_KEY = 'businesses';
const ACTIVE_BUSINESS_KEY = 'activeBusiness';
const CUSTOMERS_KEY = 'customers';
const SUPPLIERS_KEY = 'suppliers';
const TRANSACTIONS_KEY = 'transactions';

// Business operations
export const getBusinesses = (): Business[] => {
  try {
    const businesses = localStorage.getItem(BUSINESSES_KEY);
    return businesses ? JSON.parse(businesses) : [];
  } catch (error) {
    console.error('Error getting businesses:', error);
    return [];
  }
};

export const saveBusiness = (business: Business) => {
  try {
    const businesses = getBusinesses();
    businesses.push(business);
    localStorage.setItem(BUSINESSES_KEY, JSON.stringify(businesses));
  } catch (error) {
    console.error('Error saving business:', error);
  }
};

export const getActiveBusiness = (): Business | null => {
  try {
    const business = localStorage.getItem(ACTIVE_BUSINESS_KEY);
    return business ? JSON.parse(business) : null;
  } catch (error) {
    console.error('Error getting active business:', error);
    return null;
  }
};

export const setActiveBusiness = (business: Business) => {
  try {
    localStorage.setItem(ACTIVE_BUSINESS_KEY, JSON.stringify(business));
  } catch (error) {
    console.error('Error setting active business:', error);
  }
};

// Customer operations
export const getCustomers = (businessId: string): Customer[] => {
  try {
    const customers = localStorage.getItem(CUSTOMERS_KEY);
    const allCustomers = customers ? JSON.parse(customers) : [];
    return allCustomers.filter((customer: Customer) => customer.businessId === businessId);
  } catch (error) {
    console.error('Error getting customers:', error);
    return [];
  }
};

export const saveCustomer = (customer: Customer) => {
  try {
    const customers = localStorage.getItem(CUSTOMERS_KEY);
    const allCustomers = customers ? JSON.parse(customers) : [];
    allCustomers.push(customer);
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(allCustomers));
  } catch (error) {
    console.error('Error saving customer:', error);
  }
};

export const getCustomerById = (customerId: string, businessId: string): Customer | null => {
  try {
    const customers = getCustomers(businessId);
    return customers.find(customer => customer.id === customerId) || null;
  } catch (error) {
    console.error('Error getting customer by id:', error);
    return null;
  }
};

// Supplier operations
export const getSuppliers = (businessId: string): Supplier[] => {
  try {
    const suppliers = localStorage.getItem(SUPPLIERS_KEY);
    const allSuppliers = suppliers ? JSON.parse(suppliers) : [];
    return allSuppliers.filter((supplier: Supplier) => supplier.businessId === businessId);
  } catch (error) {
    console.error('Error getting suppliers:', error);
    return [];
  }
};

export const saveSupplier = (supplier: Supplier) => {
  try {
    const suppliers = localStorage.getItem(SUPPLIERS_KEY);
    const allSuppliers = suppliers ? JSON.parse(suppliers) : [];
    allSuppliers.push(supplier);
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(allSuppliers));
  } catch (error) {
    console.error('Error saving supplier:', error);
  }
};

export const getSupplierById = (supplierId: string, businessId: string): Supplier | null => {
  try {
    const suppliers = getSuppliers(businessId);
    return suppliers.find(supplier => supplier.id === supplierId) || null;
  } catch (error) {
    console.error('Error getting supplier by id:', error);
    return null;
  }
};

// Transaction operations
export const getTransactions = (businessId: string): Transaction[] => {
  try {
    const transactions = localStorage.getItem(TRANSACTIONS_KEY);
    const allTransactions = transactions ? JSON.parse(transactions) : [];
    return allTransactions.filter((transaction: Transaction) => transaction.businessId === businessId);
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

export const saveTransaction = (transaction: Transaction) => {
  try {
    const transactions = localStorage.getItem(TRANSACTIONS_KEY);
    const allTransactions = transactions ? JSON.parse(transactions) : [];
    allTransactions.push(transaction);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTransactions));

    // Update customer or supplier balance
    if (transaction.customerId) {
      const customers = localStorage.getItem(CUSTOMERS_KEY);
      const allCustomers = customers ? JSON.parse(customers) : [];
      const customerIndex = allCustomers.findIndex((c: Customer) => c.id === transaction.customerId);
      if (customerIndex !== -1) {
        allCustomers[customerIndex].balance += transaction.type === 'IN' ? -transaction.amount : transaction.amount;
        localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(allCustomers));
      }
    } else if (transaction.supplierId) {
      const suppliers = localStorage.getItem(SUPPLIERS_KEY);
      const allSuppliers = suppliers ? JSON.parse(suppliers) : [];
      const supplierIndex = allSuppliers.findIndex((s: Supplier) => s.id === transaction.supplierId);
      if (supplierIndex !== -1) {
        allSuppliers[supplierIndex].balance += transaction.type === 'IN' ? -transaction.amount : transaction.amount;
        localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(allSuppliers));
      }
    }
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
};

export const getCustomerTransactions = (customerId: string, businessId: string): Transaction[] => {
  try {
    const transactions = getTransactions(businessId);
    return transactions.filter(transaction => transaction.customerId === customerId);
  } catch (error) {
    console.error('Error getting customer transactions:', error);
    return [];
  }
};

export const getSupplierTransactions = (supplierId: string, businessId: string): Transaction[] => {
  try {
    const transactions = getTransactions(businessId);
    return transactions.filter(transaction => transaction.supplierId === supplierId);
  } catch (error) {
    console.error('Error getting supplier transactions:', error);
    return [];
  }
};

// Analytics
export const getAnalytics = (businessId: string): MonthlyAnalytics[] => {
  try {
    const transactions = getTransactions(businessId);
    const monthlyData: { [key: string]: MonthlyAnalytics } = {};

    transactions.forEach(transaction => {
      const monthKey = format(startOfMonth(new Date(transaction.date)), 'yyyy-MM');
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          totalIn: 0,
          totalOut: 0,
          balance: 0
        };
      }

      if (transaction.type === 'IN') {
        monthlyData[monthKey].totalIn += transaction.amount;
      } else {
        monthlyData[monthKey].totalOut += transaction.amount;
      }
      
      monthlyData[monthKey].balance = monthlyData[monthKey].totalIn - monthlyData[monthKey].totalOut;
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    console.error('Error getting analytics:', error);
    return [];
  }
};

// Customer operations
export const updateCustomer = (customer: Customer) => {
  try {
    const allCustomers = localStorage.getItem(CUSTOMERS_KEY);
    const customers = allCustomers ? JSON.parse(allCustomers) : [];
    const index = customers.findIndex((c: Customer) => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    }
  } catch (error) {
    console.error('Error updating customer:', error);
  }
};

export const deleteCustomer = (customerId: string, businessId: string) => {
  try {
    // Delete customer
    const allCustomers = localStorage.getItem(CUSTOMERS_KEY);
    const customers = allCustomers ? JSON.parse(allCustomers) : [];
    const newCustomers = customers.filter((c: Customer) => 
      !(c.id === customerId && c.businessId === businessId)
    );
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(newCustomers));

    // Delete associated transactions
    const allTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    const transactions = allTransactions ? JSON.parse(allTransactions) : [];
    const newTransactions = transactions.filter((t: Transaction) => 
      !(t.customerId === customerId && t.businessId === businessId)
    );
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTransactions));
  } catch (error) {
    console.error('Error deleting customer:', error);
  }
};

// Supplier operations
export const updateSupplier = (supplier: Supplier) => {
  try {
    const allSuppliers = localStorage.getItem(SUPPLIERS_KEY);
    const suppliers = allSuppliers ? JSON.parse(allSuppliers) : [];
    const index = suppliers.findIndex((s: Supplier) => s.id === supplier.id);
    if (index !== -1) {
      suppliers[index] = supplier;
      localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers));
    }
  } catch (error) {
    console.error('Error updating supplier:', error);
  }
};

export const deleteSupplier = (supplierId: string, businessId: string) => {
  try {
    // Delete supplier
    const allSuppliers = localStorage.getItem(SUPPLIERS_KEY);
    const suppliers = allSuppliers ? JSON.parse(allSuppliers) : [];
    const newSuppliers = suppliers.filter((s: Supplier) => 
      !(s.id === supplierId && s.businessId === businessId)
    );
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(newSuppliers));

    // Delete associated transactions
    const allTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    const transactions = allTransactions ? JSON.parse(allTransactions) : [];
    const newTransactions = transactions.filter((t: Transaction) => 
      !(t.supplierId === supplierId && t.businessId === businessId)
    );
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTransactions));
  } catch (error) {
    console.error('Error deleting supplier:', error);
  }
};

// Transaction deletion with cascade
export const deleteTransaction = (transaction: Transaction) => {
  try {
    // Delete the transaction
    const allTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    const transactions = allTransactions ? JSON.parse(allTransactions) : [];
    const newTransactions = transactions.filter((t: Transaction) => t.id !== transaction.id);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTransactions));

    // Update customer or supplier balance
    if (transaction.customerId) {
      const customers = localStorage.getItem(CUSTOMERS_KEY);
      const allCustomers = customers ? JSON.parse(customers) : [];
      const customerIndex = allCustomers.findIndex((c: Customer) => c.id === transaction.customerId);
      if (customerIndex !== -1) {
        // Reverse the transaction effect on balance
        allCustomers[customerIndex].balance += transaction.type === 'IN' ? transaction.amount : -transaction.amount;
        localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(allCustomers));
      }
    } else if (transaction.supplierId) {
      const suppliers = localStorage.getItem(SUPPLIERS_KEY);
      const allSuppliers = suppliers ? JSON.parse(suppliers) : [];
      const supplierIndex = allSuppliers.findIndex((s: Supplier) => s.id === transaction.supplierId);
      if (supplierIndex !== -1) {
        // Reverse the transaction effect on balance
        allSuppliers[supplierIndex].balance += transaction.type === 'IN' ? transaction.amount : -transaction.amount;
        localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(allSuppliers));
      }
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
  }
};