import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ReportView from "../components/ReportView";
import { getCustomers, getTransactions } from "../utils/storage";
import { useBusiness } from "../context/BusinessContext";

type ViewMode = "transactions" | "report";
type FilterOption =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest"
  | "in-only"
  | "out-only";

export default function AllCustomersReportPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("transactions");
  const [filterOption, setFilterOption] = useState<FilterOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const { activeBusiness } = useBusiness();

  if (!activeBusiness) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">Please select a business first</p>
      </div>
    );
  }

  const customers = getCustomers(activeBusiness.id);
  const allTransactions = getTransactions(activeBusiness.id);

  // Get only customer transactions for this business
  const customerTransactions = allTransactions.filter(
    (t) => t.customerId && t.businessId === activeBusiness.id
  );

  // Create a map of customer names
  const customerNames = customers.reduce((acc, customer) => {
    acc[customer.id] = customer.name;
    return acc;
  }, {} as { [key: string]: string });

  // Calculate totals
  const totalReceived = customerTransactions
    .filter((t) => t.type === "IN")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGiven = customerTransactions
    .filter((t) => t.type === "OUT")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/customers" className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Customer Transactions Report</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-800">Total Received</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{totalReceived}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-800">Total Given</p>
          <p className="text-lg font-semibold text-red-600">₹{totalGiven}</p>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 ${
            viewMode === "transactions"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-600"
          }`}
          onClick={() => setViewMode("transactions")}
        >
          All Transactions
        </button>
        <button
          className={`py-2 px-4 ${
            viewMode === "report"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-600"
          }`}
          onClick={() => setViewMode("report")}
        >
          Report View
        </button>
      </div>

      <ReportView
        transactions={customerTransactions}
        entityNames={customerNames}
        searchQuery={searchQuery}
        filterOption={filterOption}
      />
    </div>
  );
}
