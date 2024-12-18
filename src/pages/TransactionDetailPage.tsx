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
    return <div>Loading...</div>;
  }

  const transaction = transactions.find((t) => t.id === transactionId);

  const [paymentMode, setPaymentMode] = useState(
    transaction?.paymentMode || "CASH"
  );

  if (!transaction) {
    return (
      <div className="max-w-md mx-auto p-4 text-center mt-4">
        Transaction not found
      </div>
    );
  }

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
        // data: editForm,
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
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <CircleArrowLeft
          className="hover:cursor-pointer mt-1"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-2xl font-bold ">Transaction Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold">{entityName}</h2>
            <p className="text-gray-500">
              {format(new Date(transaction.date), "dd MMM yyyy hh:mm a")}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditForm(transaction);
                setShowEditModal(true);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Pencil className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {transaction.type === "IN" ? (
              <ArrowDownCircle className="w-8 h-8 text-green-600" />
            ) : (
              <ArrowUpCircle className="w-8 h-8 text-red-600" />
            )}
            <span
              className={`text-3xl font-bold ${
                transaction.type === "IN" ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{transaction.amount.toLocaleString()}
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Description
            </h3>
            <p className="text-gray-700">{transaction.description}</p>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Transaction"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this transaction?</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Transaction"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditForm({ ...editForm, type: "IN" })}
                className={`flex-1 py-2 px-4 rounded-md ${
                  editForm.type === "IN"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Money In
              </button>
              <button
                type="button"
                onClick={() => setEditForm({ ...editForm, type: "OUT" })}
                className={`flex-1 py-2 px-4 rounded-md ${
                  editForm.type === "OUT"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Money Out
              </button>
            </div>
          </div> */}

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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={editForm.amount || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, amount: Number(e.target.value) })
              }
              onWheel={(e: any) => {
                e.target.blur();
                e.preventDefault();
              }}
              className="w-full p-2 border rounded-md"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editForm.description || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
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
