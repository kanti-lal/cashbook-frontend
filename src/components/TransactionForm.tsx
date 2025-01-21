import { useState } from "react";
import { Customer, Supplier, Transaction } from "../types";
import SuccessAnimation from "./SuccessAnimation";
import { useBusiness } from "../context/BusinessContext";
import { Banknote, CreditCard } from "lucide-react";

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
  const { activeBusiness, createTransaction } = useBusiness();
  const [paymentMode, setPaymentMode] = useState<"CASH" | "ONLINE">("CASH");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString()
  );

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
      date: new Date(transactionDate).toISOString(), // Use selected date or default to current date
      category: hasSupplier ? "SUPPLIER" : "CUSTOMER",
      businessId: effectiveBusinessId,
      paymentMode: paymentMode,
    };
    createTransaction(transaction);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return <SuccessAnimation onComplete={onComplete} inModal={true} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-gray-900 dark:text-gray-100"
    >
      {customers && !supplierId && !customerId && (
        <div className="text-gray-900 dark:text-gray-100">
          <label
            htmlFor="customer"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Select Customer
          </label>
          <select
            id="customer"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer
              bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M19.5%208.25l-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat appearance-none"
            required
          >
            <option value="" className="dark:text-gray-100">
              Select a customer
            </option>
            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
                className="dark:text-gray-100"
              >
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {suppliers && !supplierId && !customerId && (
        <div className="text-gray-900 dark:text-gray-100">
          <label
            htmlFor="supplier"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Select Supplier
          </label>
          <select
            id="supplier"
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer
              bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M19.5%208.25l-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat appearance-none"
            required
          >
            <option value="" className="dark:text-gray-100">
              Select a supplier
            </option>
            {suppliers.map((supplier) => (
              <option
                key={supplier.id}
                value={supplier.id}
                className="dark:text-gray-100"
              >
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="text-gray-900 dark:text-gray-100">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Amount
        </label>
        <input
          type="number"
          id="amount"
          inputMode="decimal"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onWheel={(e: any) => {
            e.target.blur();
            e.preventDefault();
          }}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border dark:bg-gray-700 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          required
          min="0"
          step="0"
        />
      </div>

      <div className="flex justify-between items-center space-x-1 text-gray-900 dark:text-gray-100">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Payment Mode
        </span>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-[3px] w-36">
          <button
            type="button"
            onClick={() => setPaymentMode("CASH")}
            className={`flex items-center justify-center w-1/2 py-1 text-[11px] font-medium rounded-full transition-colors duration-200 focus:outline-none ${
              paymentMode === "CASH"
                ? "bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-400 shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            aria-pressed={paymentMode === "CASH"}
          >
            <Banknote size={12} className="mr-1" />
            Cash
          </button>
          <button
            type="button"
            onClick={() => setPaymentMode("ONLINE")}
            className={`flex items-center justify-center w-1/2 py-1 text-[11px] font-medium rounded-full transition-colors duration-200 focus:outline-none ${
              paymentMode === "ONLINE"
                ? "bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-400 shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            aria-pressed={paymentMode === "ONLINE"}
          >
            <CreditCard size={12} className="mr-1" />
            Online
          </button>
        </div>
      </div>

      <div className="text-gray-900 dark:text-gray-100">
        <label
          htmlFor="transaction-date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Transaction Date
        </label>
        <input
          type="date"
          id="transaction-date"
          placeholder="DD-MM-YYYY"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          className="mt-1 block h-[42px] w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
        />
      </div>

      <div className="text-gray-900 dark:text-gray-100">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          placeholder="Enter description"
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border dark:bg-gray-700 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
