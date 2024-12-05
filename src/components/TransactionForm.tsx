import { useState } from "react";
import { Customer, Supplier, Transaction } from "../types";
import { saveTransaction } from "../utils/storage";
import SuccessAnimation from "./SuccessAnimation";
import { useBusiness } from "../context/BusinessContext";

interface TransactionFormProps {
  type: "IN" | "OUT";
  customers?: Customer[];
  suppliers?: Supplier[];
  supplierId?: string;
  customerId?: string;
  onComplete: () => void;
  onCancel: () => void;
  businessId?: string;
}

export default function TransactionForm({
  type,
  customers,
  suppliers,
  supplierId,
  customerId,
  onComplete,
  onCancel,
  businessId,
}: TransactionFormProps) {
  const [amount, setAmount] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customerId || ""
  );
  const [selectedSupplierId, setSelectedSupplierId] = useState(
    supplierId || ""
  );
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { activeBusiness } = useBusiness();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    // Validate selection
    const hasCustomer = selectedCustomerId || customerId;
    const hasSupplier = selectedSupplierId || supplierId;
    if (!hasCustomer && !hasSupplier) return;

    // Get the business ID either from props or context
    const effectiveBusinessId = businessId || activeBusiness?.id;
    if (!effectiveBusinessId) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      customerId: selectedCustomerId || customerId,
      supplierId: selectedSupplierId || supplierId,
      description,
      date: new Date().toISOString(),
      category: hasSupplier ? "SUPPLIER" : "CUSTOMER",
      businessId: effectiveBusinessId,
    };

    saveTransaction(transaction);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return <SuccessAnimation onComplete={onComplete} inModal={true} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {customers && !supplierId && !customerId && (
        <div>
          <label
            htmlFor="customer"
            className="block text-sm font-medium text-gray-700"
          >
            Select Customer
          </label>
          <select
            id="customer"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
            required
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {suppliers && !supplierId && !customerId && (
        <div>
          <label
            htmlFor="supplier"
            className="block text-sm font-medium text-gray-700"
          >
            Select Supplier
          </label>
          <select
            id="supplier"
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
            required
          >
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
