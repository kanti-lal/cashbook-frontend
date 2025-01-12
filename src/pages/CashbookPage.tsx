import { useState, useMemo } from "react";
import { format, isSameDay, startOfToday } from "date-fns";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  TrendingUp,
  Search,
  Download,
  LoaderCircle,
} from "lucide-react";
import TransactionForm from "../components/TransactionForm";
import { Transaction } from "../types";
import Modal from "../components/Modal";
import { useBusiness } from "../context/BusinessContext";
import { useNavigate } from "react-router-dom";

type EntityType = "CUSTOMER" | "SUPPLIER";
type FilterOption =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest"
  | "in-only"
  | "out-only";

interface DayTransactions {
  date: string;
  transactions: Transaction[];
  totalIn: number;
  totalOut: number;
}

export default function CashbookPage() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"IN" | "OUT">("IN");
  const [entityType, setEntityType] = useState<EntityType>("CUSTOMER");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState<FilterOption>("newest");

  const navigate = useNavigate(); // Add navigation hook
  const {
    activeBusiness,
    transactions,
    customers,
    suppliers,
    isLoading,
    exportTransactionsPDF,
    isExportingTransactionsPDF,
  } = useBusiness();

  const handleTransactionDetailClick = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
  };

  // Create a map of entity names for quick lookup
  const entityNames = useMemo(() => {
    const names: { [key: string]: string } = {};
    customers.forEach((c) => (names[c.id] = c.name));
    suppliers.forEach((s) => (names[s.id] = s.name));
    return names;
  }, [customers, suppliers]);

  // Calculate total cash in hand (all time balance)
  const totalCashInHand = transactions.reduce((sum, t) => {
    return sum + (t.type === "IN" ? t.amount : -t.amount);
  }, 0);

  // Calculate today's transactions
  const today = startOfToday();
  const todaysTransactions = transactions.filter((t) =>
    isSameDay(new Date(t.date), today)
  );

  const todaysIn = todaysTransactions.reduce(
    (sum, t) => (t.type === "IN" ? sum + t.amount : sum),
    0
  );

  const todaysOut = todaysTransactions.reduce(
    (sum, t) => (t.type === "OUT" ? sum + t.amount : sum),
    0
  );

  const todaysBalance = todaysIn - todaysOut;

  // Filter and group transactions
  const groupedTransactions = useMemo(() => {
    // First, filter transactions
    let filteredTransactions = [...transactions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTransactions = filteredTransactions.filter((t) => {
        const entityName =
          entityNames[t.customerId || t.supplierId || ""]?.toLowerCase();
        return (
          entityName?.includes(query) ||
          t.description?.toLowerCase().includes(query)
        );
      });
    }

    // Apply combined filter
    switch (filterOption) {
      case "in-only":
        filteredTransactions = filteredTransactions.filter(
          (t) => t.type === "IN"
        );
        break;
      case "out-only":
        filteredTransactions = filteredTransactions.filter(
          (t) => t.type === "OUT"
        );
        break;
      case "oldest":
        filteredTransactions.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "highest":
        filteredTransactions.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        filteredTransactions.sort((a, b) => a.amount - b.amount);
        break;
      default: // 'newest'
        filteredTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }

    // Then group by date
    const groups: { [key: string]: DayTransactions } = {};

    filteredTransactions.forEach((transaction: any) => {
      const dateKey = format(new Date(transaction.date), "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          transactions: [],
          totalIn: 0,
          totalOut: 0,
        };
      }

      groups[dateKey].transactions.push({
        ...transaction,
        businessId: activeBusiness!.id,
        paymentMode: transaction.paymentMode || "CASH", // Add default payment mode
      });
      if (transaction.type === "IN") {
        groups[dateKey].totalIn += transaction.amount;
      } else {
        groups[dateKey].totalOut += transaction.amount;
      }
    });

    return Object.values(groups).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, searchQuery, filterOption, entityNames]);

  const handleTransactionClick = (type: "IN" | "OUT") => {
    setTransactionType(type);
    setIsTransactionModalOpen(true);
  };

  const handleTransactionComplete = () => {
    setIsTransactionModalOpen(false);
  };

  const handleExportPDF = async () => {
    try {
      await exportTransactionsPDF();
    } catch (error) {
      // Handle error (you might want to show a toast or alert)
      console.error("Failed to export PDF:", error);
    }
  };

  if (!activeBusiness) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">Please select a business first</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 items-center justify-center">
        <p className="text-gray-600">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 ">
      {/* Fixed top section */}
      <div className="flex-none bg-gray-50">
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold mb-1 md:mb-3">Cashbook</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 mb-2 md:mb-3">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm text-gray-700">Cash in Hand</h3>
              </div>
              <p
                className={`text-base font-semibold ${
                  totalCashInHand >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{Math.abs(totalCashInHand)}
              </p>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm text-gray-700">Today's Summary</h3>
              </div>
              <div className="flex gap-2 items-baseline">
                <p
                  className={`text-base font-semibold ${
                    todaysBalance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{Math.abs(todaysBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2 md:mb-3">
            <button
              onClick={() => handleTransactionClick("IN")}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
            >
              <ArrowDownCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700 text-sm">
                Money IN
              </span>
            </button>
            <button
              onClick={() => handleTransactionClick("OUT")}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
            >
              <ArrowUpCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-700 text-sm">
                Money OUT
              </span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-2 mb-1">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 text-md border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value as FilterOption)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white min-w-[120px]"
            >
              <optgroup label="Sort">
                <option value="newest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Amt ↓</option>
                <option value="lowest">Amt ↑</option>
              </optgroup>
              <optgroup label="Filter">
                <option value="in-only">IN Only</option>
                <option value="out-only">OUT Only</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        title={`New ${
          transactionType === "IN" ? "Money IN" : "Money OUT"
        } Transaction`}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction With
          </label>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setEntityType("CUSTOMER")}
              className={`flex-1 py-2 px-4 rounded-md ${
                entityType === "CUSTOMER"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setEntityType("SUPPLIER")}
              className={`flex-1 py-2 px-4 rounded-md ${
                entityType === "SUPPLIER"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Supplier
            </button>
          </div>
        </div>
        <TransactionForm
          type={transactionType}
          customers={
            entityType === "CUSTOMER"
              ? customers.map((c) => ({ ...c, businessId: activeBusiness.id }))
              : undefined
          }
          suppliers={
            entityType === "SUPPLIER"
              ? suppliers.map((s) => ({ ...s, businessId: activeBusiness.id }))
              : undefined
          }
          onComplete={handleTransactionComplete}
          onCancel={() => setIsTransactionModalOpen(false)}
          businessId={activeBusiness.id}
        />
      </Modal>

      {/* Sticky header */}
      <div className="flex-none bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-1">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button
              onClick={handleExportPDF}
              disabled={isExportingTransactionsPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExportingTransactionsPDF ? (
                <span className="inline-block animate-spin">
                  <LoaderCircle className="w-4 h-4" />
                </span>
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>
                {isExportingTransactionsPDF ? "Exporting..." : "Export PDF"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable transactions section */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto p-4 space-y-3">
          {groupedTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No transactions found
            </p>
          ) : (
            groupedTransactions.map((group) => (
              <div key={group.date} className="space-y-1">
                {/* Date header with new styling */}
                <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-purple-900">
                        {format(new Date(group.date), "dd MMM yyyy")}
                      </h3>
                      <span className="text-xs px-2 py-0.5 bg-purple-100 rounded-full text-purple-700">
                        {group.transactions.length} transactions
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <span className="text-green-600 flex items-center gap-1">
                        <ArrowDownCircle className="w-3 h-3" />₹{group.totalIn}
                      </span>
                      <span className="text-red-600 flex items-center gap-1">
                        <ArrowUpCircle className="w-3 h-3" />₹{group.totalOut}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transactions list with reduced spacing */}
                <div className="space-y-1">
                  {group.transactions.map((transaction) => {
                    const entityName = transaction.customerId
                      ? customers.find((c) => c.id === transaction.customerId)
                          ?.name
                      : suppliers.find((s) => s.id === transaction.supplierId)
                          ?.name;

                    const transactionDate = new Date(transaction.date);

                    return (
                      <div
                        key={transaction.id}
                        className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                        onClick={() =>
                          handleTransactionDetailClick(transaction.id)
                        }
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {entityName}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {transaction.customerId ? "Customer" : "Supplier"}
                            </p>
                            {transaction.description && (
                              <p className="text-sm text-gray-600 mt-0.5">
                                {transaction.description.length > 25
                                  ? `${transaction.description.slice(0, 25)}..`
                                  : transaction.description}
                              </p>
                            )}
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <span>{format(transactionDate, "h:mm a")}</span>
                              <span className="text-gray-400">•</span>
                              <span>
                                {format(transactionDate, "dd MMM yyyy")}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`font-medium ${
                              transaction.type === "IN"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "IN" ? "+" : "-"}₹
                            {transaction.amount}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
