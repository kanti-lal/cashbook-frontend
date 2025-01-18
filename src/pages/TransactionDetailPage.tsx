import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBusiness } from "../context/BusinessContext";
import { Transaction } from "../api/types";
import Modal from "../components/Modal";
import { format } from "date-fns";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  CircleArrowLeft,
  CreditCard,
  Pencil,
  Trash2,
} from "lucide-react";

export default function TransactionDetailPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const {
    transactions,
    customers,
    suppliers,
    deleteTransaction,
    updateTransaction,
    activeBusiness,
  } = useBusiness();

  if (!activeBusiness || !transactionId) {
    return <div className="text-gray-800 dark:text-gray-200">Loading...</div>;
  }

  const transaction = transactions.find((t) => t.id === transactionId);

  if (!transaction) {
    return (
      <div className="max-w-md mx-auto p-4 text-center mt-4">
        Transaction not found
      </div>
    );
  }

  const [paymentMode, setPaymentMode] = useState(
    transaction.paymentMode || "CASH"
  );

  const entityName = transaction.customerId
    ? customers.find((c) => c.id === transaction.customerId)?.name
    : suppliers.find((s) => s.id === transaction.supplierId)?.name;

  const handleDelete = async () => {
    try {
      await deleteTransaction(transactionId);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTransaction({
        transactionId,
        data: {
          ...editForm,
          paymentMode,
        },
      });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleTransactionTypeChange = (type: "IN" | "OUT") => {
    setEditForm({ ...editForm, type });
  };

  return (
    <div className="max-w-md md:max-w-4xl mx-auto p-4 dark:bg-gray-900">
      <div className="flex items-center gap-4 mb-6">
        <CircleArrowLeft
          className="hover:cursor-pointer dark:text-gray-200 w-6 h-6"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          Transaction Details
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-start mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold dark:text-white mb-2">
              {entityName || "Unnamed Entity"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
              {format(new Date(transaction.date), "dd MMM yyyy hh:mm a")}
            </p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => {
                setEditForm(transaction);
                setShowEditModal(true);
              }}
              className="p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Pencil className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Trash2 className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            </button>
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-4 md:space-y-6 mb-6 md:mb-0">
            <div className="flex items-center gap-3 md:gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 md:p-6 rounded-xl">
              {transaction.type === "IN" ? (
                <ArrowDownCircle className="w-8 md:w-12 h-8 md:h-12 text-green-600" />
              ) : (
                <ArrowUpCircle className="w-8 md:w-12 h-8 md:h-12 text-red-600" />
              )}
              <span
                className={`text-2xl md:text-4xl font-bold ${
                  transaction.type === "IN" ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{transaction.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 md:p-6 rounded-xl">
              {transaction.paymentMode === "CASH" ? (
                <Banknote className="w-5 md:w-6 h-5 md:h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <CreditCard className="w-5 md:w-6 h-5 md:h-6 text-gray-600 dark:text-gray-400" />
              )}
              <span className="text-base md:text-lg text-gray-600 dark:text-gray-400">
                {transaction.paymentMode === "CASH"
                  ? "Cash Payment"
                  : "Online Payment"}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 md:p-6 rounded-xl h-full">
            <h3 className="text-base md:text-lg font-medium text-gray-500 dark:text-gray-400 mb-2 md:mb-3">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              {transaction.description || "No description provided"}
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Transaction"
      >
        <div className="space-y-4">
          <p className="dark:text-gray-300">
            Are you sure you want to delete this transaction?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Transaction"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              type="button"
              onClick={() => handleTransactionTypeChange("IN")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors ${
                editForm.type === "IN"
                  ? "bg-green-100 hover:bg-green-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <ArrowDownCircle className="w-5 h-5 text-green-600" />
              <span
                className={`font-medium text-sm ${
                  editForm.type === "IN" ? "text-green-700" : "text-gray-700"
                }`}
              >
                Money IN
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleTransactionTypeChange("OUT")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors ${
                editForm.type === "OUT"
                  ? "bg-red-100 hover:bg-red-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <ArrowUpCircle className="w-5 h-5 text-red-600" />
              <span
                className={`font-medium text-sm ${
                  editForm.type === "OUT" ? "text-red-700" : "text-gray-700"
                }`}
              >
                Money OUT
              </span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={editForm.amount || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, amount: Number(e.target.value) })
              }
              className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex justify-between items-center space-x-1">
            <span className="text-sm font-medium text-gray-700">
              Payment Mode
            </span>
            <div className="flex bg-gray-100 rounded-full p-[3px] w-36">
              <button
                type="button"
                onClick={() => setPaymentMode("CASH")}
                className={`flex items-center justify-center w-1/2 py-1 text-[11px] font-medium rounded-full transition-colors duration-200 focus:outline-none ${
                  paymentMode === "CASH"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-200"
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
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                aria-pressed={paymentMode === "ONLINE"}
              >
                <CreditCard size={12} className="mr-1" />
                Online
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="datetime-local"
              value={format(
                new Date(editForm.date || transaction.date),
                "yyyy-MM-dd'T'HH:mm"
              )}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  date: new Date(e.target.value).toISOString(),
                })
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={editForm.description || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
