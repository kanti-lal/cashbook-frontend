import { useState, useMemo } from "react";
import {
  Plus,
  ChevronRight,
  Search,
  FileText,
  Download,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import AddCustomerForm from "../components/AddCustomerForm";
import { useBusiness } from "../context/BusinessContext";
import Modal from "../components/Modal";
import { Customer } from "../types";

type SortOption = "name" | "oldest" | "highest" | "lowest";

export default function CustomersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  // const [customers, setCustomers] = useState([]);
  const {
    activeBusiness,
    customers,
    createCustomer,
    exportAllCustomersLedgerPDF,
    isExportingAllCustomersLedgerPDF,
  } = useBusiness();

  // // Calculate total balances
  // const totalToGive = customers.reduce(
  //   (sum, customer) =>
  //     customer.balance < 0 ? sum + Math.abs(customer.balance) : sum,
  //   0
  // );

  // const totalToGet = customers.reduce(
  //   (sum, customer) => (customer.balance > 0 ? sum + customer.balance : sum),
  //   0
  // );

  // Calculate total balances
  const totalToGet = customers.reduce(
    (sum, customer) =>
      customer.balance < 0 ? sum + Math.abs(customer.balance) : sum,
    0
  );

  const totalToGive = customers.reduce(
    (sum, customer) => (customer.balance > 0 ? sum + customer.balance : sum),
    0
  );

  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.phoneNumber.includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "oldest":
        result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
      case "highest":
        result.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
        break;
      case "lowest":
        result.sort((a, b) => Math.abs(a.balance) - Math.abs(b.balance));
        break;
    }

    return result;
  }, [customers, searchQuery, sortBy]);

  // const handleAddCustomer = () => {
  //   fetchCustomers(); // Refresh the list
  //   setShowAddModal(false);
  //   refreshCustomers(); // Refresh global state
  // };

  const handleAddCustomer = async (customerData: Customer) => {
    try {
      await createCustomer(customerData);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  if (!activeBusiness) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">Please select a business first</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-20 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Customers</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Modal for adding customer */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Customer"
      >
        <AddCustomerForm onAdd={handleAddCustomer} />
      </Modal>

      {/* View Report Button */}
      <div className="flex gap-2 mb-3 w-full">
        <div className="w-full">
          <Link
            to="/customers/report"
            className="w-full mb-3 py-3 px-4 flex-1 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center gap-2  hover:bg-purple-200 transition-colors text-sm  md:text-[16px]"
          >
            <FileText size={20} />
            View Customer Report
          </Link>
        </div>
        <button
          onClick={() => exportAllCustomersLedgerPDF()}
          disabled={isExportingAllCustomersLedgerPDF}
          className="py-3 w-[210px] px-4 mb-3 bg-purple-100 text-purple-700 rounded-lg flex items-center gap-2 justify-center hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-[16px]"
        >
          {isExportingAllCustomersLedgerPDF ? (
            <span className="inline-block animate-spin">
              <LoaderCircle className="w-5 h-5" />
            </span>
          ) : (
            <Download size={20} />
          )}
          <span>
            {isExportingAllCustomersLedgerPDF ? "Exporting..." : "Export PDF"}
          </span>
        </button>
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-800">You Will Give</p>
          <p className="text-lg font-semibold text-green-600">₹{totalToGive}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-800">You Will Get</p>
          <p className="text-lg font-semibold text-red-600">₹{totalToGet}</p>
        </div>
      </div>

      {/* Search and Sort in one line */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-2 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-2 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="name">A-Z</option>
          <option value="oldest">Date ↑</option>
          <option value="highest">Amt ↓</option>
          <option value="lowest">Amt ↑</option>
        </select>
      </div>

      <div className="space-y-2">
        {filteredAndSortedCustomers.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No customers found</p>
        ) : (
          filteredAndSortedCustomers.map((customer) => (
            <Link
              key={customer.id}
              to={`/customers/${customer.id}`}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div>
                <h3 className="font-medium dark:text-white">{customer.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {customer.phoneNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {customer.balance === 0
                    ? "No balance"
                    : customer.balance > 0
                    ? "You will give"
                    : "You will get"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-medium ${
                    customer.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{Math.abs(customer.balance)}
                </span>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
