import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useBusiness } from "../context/BusinessContext";
import TransactionsList from "../components/TransactionsList";

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
  const { activeBusiness, transactions, customers } = useBusiness();

  if (!activeBusiness) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">Please select a business first</p>
      </div>
    );
  }

  // Get only customer transactions for this business
  const customerTransactions = transactions.filter(
    (t) => t.customerId !== undefined && t.customerId !== null
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

  // Add customer-wise summary calculation
  const customerSummary = customers.map((customer) => {
    const customerTxns = customerTransactions.filter(
      (t) => t.customerId === customer.id
    );

    const received = customerTxns
      .filter((t) => t.type === "IN")
      .reduce((sum, t) => sum + t.amount, 0);

    const given = customerTxns
      .filter((t) => t.type === "OUT")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      id: customer.id,
      name: customer.name,
      received,
      given,
      balance: received - given,
    };
  });

  return (
    <div className="max-w-md mx-auto p-4 pb-20 dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/customers"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <ChevronLeft size={24} className="dark:text-gray-200" />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold dark:text-white">
          Customer Transactions Report
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300">
            Total Received
          </p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            ₹{totalReceived}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">Total Given</p>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            ₹{totalGiven}
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
        <TransactionsList
          transactions={customerTransactions}
          customerNames={customerNames}
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
                    Customer
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-300">
                    Received
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-300">
                    Given
                  </th>
                  <th className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-300">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="dark:text-gray-200">
                {customerSummary.map((summary) => (
                  <tr
                    key={summary.id}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="px-4 py-2">{summary.name}</td>
                    <td className="px-4 py-2 text-right text-green-600 dark:text-green-400">
                      ₹{summary.received}
                    </td>
                    <td className="px-4 py-2 text-right text-red-600 dark:text-red-400">
                      ₹{summary.given}
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
