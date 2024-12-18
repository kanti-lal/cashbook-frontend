import { format } from "date-fns";
import { Transaction } from "../types";
import { useState } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

interface TransactionItemProps {
  transaction: Transaction;
  entityName: string;
}

export default function TransactionItem({
  transaction,
  entityName,
}: TransactionItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const transactionDate = new Date(transaction.date);
  const navigate = useNavigate();

  const handleDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleTransactionDetailClick = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
  };

  return (
    <>
      <div
        className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:cursor-pointer"
        onClick={() => handleTransactionDetailClick(transaction.id)}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-gray-900">{entityName}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {transaction.customerId ? "Customer" : "Supplier"}
            </p>

            {transaction.description.length > 25
              ? `${transaction.description.slice(0, 25)}..`
              : transaction.description}
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>{format(transactionDate, "h:mm a")}</span>
              <span className="text-gray-400">•</span>
              <span>{format(transactionDate, "dd MMM yyyy")}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span
              className={`font-medium ${
                transaction.type === "IN" ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.type === "IN" ? "+" : "-"}₹{transaction.amount}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Transaction"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this transaction? This will also
            update the {transaction.customerId ? "customer" : "supplier"}{" "}
            balance. This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
