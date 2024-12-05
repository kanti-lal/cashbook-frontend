import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ReportView from "../components/ReportView";
import { getSuppliers, getTransactions } from "../utils/storage";
import { useBusiness } from "../context/BusinessContext";

type ViewMode = "transactions" | "report";
type FilterOption =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest"
  | "in-only"
  | "out-only";

export default function AllSuppliersReportPage() {
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

  const suppliers = getSuppliers(activeBusiness.id);
  const allTransactions = getTransactions(activeBusiness.id);

  // Get only supplier transactions for this business
  const supplierTransactions = allTransactions.filter(
    (t) => t.supplierId && t.businessId === activeBusiness.id
  );

  // Create a map of supplier names
  const supplierNames = suppliers.reduce((acc, supplier) => {
    acc[supplier.id] = supplier.name;
    return acc;
  }, {} as { [key: string]: string });

  // Calculate totals
  const totalPaid = supplierTransactions
    .filter((t) => t.type === "IN")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPurchased = supplierTransactions
    .filter((t) => t.type === "OUT")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/suppliers" className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Supplier Transactions Report</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-800">Total Paid</p>
          <p className="text-lg font-semibold text-green-600">₹{totalPaid}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-800">Total Purchased</p>
          <p className="text-lg font-semibold text-red-600">
            ₹{totalPurchased}
          </p>
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
        transactions={supplierTransactions}
        entityNames={supplierNames}
        searchQuery={searchQuery}
        filterOption={filterOption}
      />
    </div>
  );
}
