import { useState, useMemo } from "react";
import {
  format,
  subDays,
  subMonths,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Transaction } from "../types";

interface ReportViewProps {
  transactions: Transaction[];
  entityNames: { [key: string]: string };
  searchQuery: string;
  filterOption:
    | "newest"
    | "oldest"
    | "highest"
    | "lowest"
    | "in-only"
    | "out-only";
}

type DateFilter = "all" | "lastWeek" | "lastMonth" | "custom";

export default function ReportView({
  transactions,
  entityNames,
  searchQuery,
  filterOption,
}: ReportViewProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => {
        const entityName =
          entityNames[t.customerId || t.supplierId || ""]?.toLowerCase();
        return (
          entityName?.includes(query) ||
          t.description?.toLowerCase().includes(query)
        );
      });
    }

    // Apply transaction type filter
    if (filterOption === "in-only") {
      filtered = filtered.filter((t) => t.type === "IN");
    } else if (filterOption === "out-only") {
      filtered = filtered.filter((t) => t.type === "OUT");
    }

    // Apply date filter
    filtered = filtered.filter((t) => {
      const transactionDate = new Date(t.date);
      const today = new Date();

      switch (dateFilter) {
        case "lastWeek":
          return isWithinInterval(transactionDate, {
            start: subDays(today, 7),
            end: today,
          });
        case "lastMonth":
          return isWithinInterval(transactionDate, {
            start: subMonths(today, 1),
            end: today,
          });
        case "custom":
          if (!startDate || !endDate) return true;
          return isWithinInterval(transactionDate, {
            start: startOfDay(new Date(startDate)),
            end: endOfDay(new Date(endDate)),
          });
        default:
          return true;
      }
    });

    // Apply sorting
    switch (filterOption) {
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "highest":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      default: // 'newest'
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }

    return filtered;
  }, [
    transactions,
    searchQuery,
    dateFilter,
    startDate,
    endDate,
    filterOption,
    entityNames,
  ]);

  // Calculate totals for filtered transactions
  const totalIn = filteredTransactions
    .filter((t) => t.type === "IN")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = filteredTransactions
    .filter((t) => t.type === "OUT")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Date filter */}
      <div className="flex gap-2">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Time</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="custom">Custom Date</option>
        </select>
      </div>

      {dateFilter === "custom" && (
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Summary for filtered transactions */}
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">Total In</span>
          </div>
          <p className="text-lg font-semibold text-green-600">₹{totalIn}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">Total Out</span>
          </div>
          <p className="text-lg font-semibold text-red-600">₹{totalOut}</p>
        </div>
      </div>

      {/* Transactions list */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No transactions found
          </p>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {
                      entityNames[
                        transaction.customerId || transaction.supplierId || ""
                      ]
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(transaction.date), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <span
                  className={`font-medium ${
                    transaction.type === "IN"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "IN" ? "+" : "-"}₹{transaction.amount}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
