import { useParams, useNavigate } from "react-router-dom";

import { format } from "date-fns";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";

import TransactionForm from "../components/TransactionForm";
import EditCustomerForm from "../components/EditCustomerForm";
import ReportView from "../components/ReportView";
import { useState } from "react";
import { useBusiness } from "../context/BusinessContext";
import Modal from "../components/Modal";
import TransactionItem from "../components/TransactionItem";

type ViewMode = "transactions" | "report";

export default function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionType, setTransactionType] = useState<"IN" | "OUT">("IN");
  const [viewMode, setViewMode] = useState<ViewMode>("transactions");

  const {
    activeBusiness,
    getCustomerById,
    transactions,
    updateCustomer,
    deleteCustomer,
    getCustomerTransactions,
  } = useBusiness();

  const { data: customerDetails, isLoading: isLoadingCustomer } =
    getCustomerById(customerId);

  if (!activeBusiness || !customerId) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">Please select a business first</p>
      </div>
    );
  }

  const {
    data: customerTransactions,
    isLoading: isLoadingSupplierTransactions,
  } = getCustomerTransactions(customerId);

  if (isLoadingCustomer || isLoadingSupplierTransactions) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        Loading customer details...
      </div>
    );
  }

  if (!customerDetails) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">Customer not found</div>
    );
  }

  // Group transactions by date
  const groupedTransactions = (customerTransactions || []).reduce(
    (groups: any[], transaction) => {
      const date = format(new Date(transaction.date), "yyyy-MM-dd");
      const existingGroup = groups.find((group) => group.date === date);

      if (existingGroup) {
        existingGroup.transactions.push(transaction);
        existingGroup.totalIn +=
          transaction.type === "IN" ? transaction.amount : 0;
        existingGroup.totalOut +=
          transaction.type === "OUT" ? transaction.amount : 0;
      } else {
        groups.push({
          date,
          transactions: [transaction],
          totalIn: transaction.type === "IN" ? transaction.amount : 0,
          totalOut: transaction.type === "OUT" ? transaction.amount : 0,
        });
      }

      return groups;
    },
    []
  );

  // Sort groups by date (newest first) and transactions within each group
  groupedTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  groupedTransactions.forEach((group) => {
    group.transactions.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  const handleTransactionComplete = () => {
    setShowTransactionForm(false);
  };

  const handleEditComplete = async (customerData: any) => {
    try {
      await updateCustomer({
        customerId: customerId,
        data: {
          name: customerData?.name,
          phoneNumber: customerData?.phoneNumber,
          balance: customerData?.balance,
        },
      });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDelete = () => {
    deleteCustomer(customerId, activeBusiness?.id);
    navigate("/customers");
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate(-1)} className="">
          <CircleArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-2xl font-bold ">Customer Details page</h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-xl font-bold">{customerDetails.name}</h1>
            <p className="text-gray-600 text-sm">
              {customerDetails.phoneNumber}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Pencil size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Trash2 size={20} className="text-red-600" />
            </button>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setTransactionType("IN");
              setShowTransactionForm(true);
            }}
            className="py-2 px-4 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
          >
            Get Money
          </button>
          <button
            onClick={() => {
              setTransactionType("OUT");
              setShowTransactionForm(true);
            }}
            className="py-2 px-4 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Give Money
          </button>
        </div>
        <p
          className={`text-md mt-2 font-semibold ${
            customerDetails.balance >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          Balance: ₹{Math.abs(customerDetails.balance)}
        </p>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Customer"
      >
        <EditCustomerForm
          customer={customerDetails}
          onComplete={handleEditComplete}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Customer"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this customer? This will also delete
            all associated transactions. This action cannot be undone.
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
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTransactionForm}
        onClose={() => setShowTransactionForm(false)}
        title={transactionType === "IN" ? "Get Money" : "Give Money"}
      >
        <TransactionForm
          type={transactionType}
          customerId={customerDetails.id}
          onComplete={handleTransactionComplete}
          onCancel={() => setShowTransactionForm(false)}
          businessId={activeBusiness.id}
        />
      </Modal>

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
          Transactions
        </button>
        <button
          className={`py-2 px-4 ${
            viewMode === "report"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-600"
          }`}
          onClick={() => setViewMode("report")}
        >
          Report
        </button>
      </div>

      {viewMode === "transactions" ? (
        <div className="space-y-4">
          {groupedTransactions.map((group) => (
            <div key={group.date} className="space-y-1">
              {/* Date header */}
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

              {/* Transactions */}
              <div className="space-y-1">
                {group.transactions.map((transaction: any) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    entityName={customerDetails.name}
                  />
                ))}
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No transactions yet
            </p>
          )}
        </div>
      ) : (
        <ReportView
          transactions={transactions}
          entityNames={{ [customerDetails.id]: customerDetails.name }}
          searchQuery=""
          filterOption="newest"
        />
      )}
    </div>
  );
}
