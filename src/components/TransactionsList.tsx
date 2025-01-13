import { format } from "date-fns";
import { Transaction } from "../types";

interface TransactionsListProps {
  transactions: Transaction[];
  customerNames: { [key: string]: string };
  searchQuery: string;
  filterOption: string;
}

export default function TransactionsList({
  transactions,
  customerNames,
  searchQuery,
  filterOption,
}: TransactionsListProps) {
  // Apply filters and search
  let filteredTransactions = transactions.filter((t) => {
    const customerName = customerNames[t.customerId || ""];
    return customerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Apply sorting based on filterOption
  filteredTransactions = [...filteredTransactions].sort((a, b) => {
    switch (filterOption) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "highest":
        return b.amount - a.amount;
      case "lowest":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      {filteredTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="border rounded-lg p-4 flex justify-between items-center dark:border-gray-700 dark:bg-gray-800"
        >
          <div>
            <p className="font-medium dark:text-gray-100">
              {customerNames[transaction.customerId || ""]}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transaction.date &&
                format(new Date(transaction.date), "dd MMM yyyy")}
            </p>
          </div>
          <div
            className={`font-semibold ${
              transaction.type === "IN"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {transaction.type === "IN" ? "+" : "-"}₹{transaction.amount}
          </div>
        </div>
      ))}
    </div>
  );
}
