import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ReportView from "../components/ReportView";
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
  const { activeBusiness, transactions, suppliers } = useBusiness();

  if (!activeBusiness) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">Please select a business first</p>
      </div>
    );
  }

  // const suppliers = getSuppliers(activeBusiness.id);

  // Get only supplier transactions
  const supplierTransactions = transactions.filter(
    (t) => t.supplierId !== undefined && t.supplierId !== null
  );

  // Create a map of supplier names
  const supplierNames = suppliers.reduce((acc, supplier) => {
    acc[supplier.id] = supplier.name;
    return acc;
  }, {} as { [key: string]: string });

  // Calculate totals
  const totalPurchased = (supplierTransactions || [])
    .filter((t) => t.type === "IN")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPaid = (supplierTransactions || [])
    .filter((t) => t.type === "OUT")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate supplier-wise summary for report view
  const supplierSummary = suppliers.map((supplier) => {
    const supplierTxns = supplierTransactions.filter(
      (t) => t.supplierId === supplier.id
    );

    const purchased = supplierTxns
      .filter((t) => t.type === "IN")
      .reduce((sum, t) => sum + t.amount, 0);

    const paid = supplierTxns
      .filter((t) => t.type === "OUT")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      id: supplier.id,
      name: supplier.name,
      purchased,
      paid,
      balance: purchased - paid,
    };
  });

  return (
    <div className="max-w-md mx-auto p-4 pb-20 dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/suppliers"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <ChevronLeft size={24} className="dark:text-gray-200" />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold dark:text-white">
          Supplier Transactions Report
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300">
            Total Purchased
          </p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            ₹{totalPurchased}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">Total Paid</p>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            ₹{totalPaid}
          </p>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex mb-4 border-b dark:border-gray-700">
        <button
          className={`py-2 px-4 ${
            viewMode === "transactions"
              ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setViewMode("transactions")}
        >
          All Transactions
        </button>
        <button
          className={`py-2 px-4 ${
            viewMode === "report"
              ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setViewMode("report")}
        >
          Report View
        </button>
      </div>

      {viewMode === "transactions" ? (
        <ReportView
          transactions={supplierTransactions}
          entityNames={supplierNames}
          searchQuery={searchQuery}
          filterOption={filterOption}
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-300">
                    Supplier
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-300">
                    Purchased
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-300">
                    Paid
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-300">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="dark:text-gray-200">
                {supplierSummary.map((summary) => (
                  <tr
                    key={summary.id}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="px-4 py-2">{summary.name}</td>
                    <td className="px-4 py-2 text-right text-green-600 dark:text-green-400">
                      ₹{summary.purchased}
                    </td>
                    <td className="px-4 py-2 text-right text-red-600 dark:text-red-400">
                      ₹{summary.paid}
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-medium ${
                        summary.balance >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      ₹{summary.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
