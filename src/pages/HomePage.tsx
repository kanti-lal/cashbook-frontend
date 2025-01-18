import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Store, CheckCircle, BookOpen, Contact } from "lucide-react";
import { useBusiness } from "../context/BusinessContext";
import { Business } from "../api/types";
import Modal from "../components/Modal";

export default function HomePage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState("");
  const navigate = useNavigate();

  const {
    businesses,
    isLoading,
    createBusiness,
    setActiveBusiness,
    activeBusiness,
  } = useBusiness();

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusinessName.trim()) return;

    try {
      const newBusiness: Business = await createBusiness({
        name: newBusinessName.trim(),
        createdAt: new Date().toISOString(),
      });
      setNewBusinessName("");
      setShowAddForm(false);
      setActiveBusiness(newBusiness);
      navigate("/cashbook");
    } catch (error) {
      console.error("Failed to create business:", error);
      // You might want to add error handling UI here
    }
  };

  const handleSelectBusiness = (business: Business) => {
    setActiveBusiness(business);
    navigate("/cashbook");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-md md:max-w-4xl mx-auto p-4 pb-20 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Businesses</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          aria-label="Add new business"
        >
          <Plus size={24} />
        </button>
      </div>

      {activeBusiness && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/cashbook")}
            disabled={!activeBusiness}
            className="
              flex items-center justify-center 
              bg-purple-600 text-white 
              py-2 md:py-3 px-4 rounded-lg 
              hover:bg-purple-700 
              dark:bg-purple-700 dark:hover:bg-purple-800
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              md:text-base text-sm
            "
          >
            <BookOpen className="mr-2" size={20} />
            Open Cashbook
          </button>
          <button
            onClick={() => navigate("/customers")}
            disabled={!activeBusiness}
            className="
              flex items-center justify-center 
              bg-green-600 text-white 
              py-2 px-4 rounded-lg 
              hover:bg-green-700 
              dark:bg-green-700 dark:hover:bg-green-800
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              md:text-base text-sm
            "
          >
            <Contact className="mr-2" size={20} />
            Customer Page
          </button>
        </div>
      )}

      {/* {showAddForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            Create New Business
          </h2>
          <form onSubmit={handleCreateBusiness} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Business Name
              </label>
              <input
                type="text"
                id="name"
                value={newBusinessName}
                onChange={(e) => setNewBusinessName(e.target.value)}
                placeholder="Enter business name"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white p-2 border"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-purple-600 dark:bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )} */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Create New Business"
      >
        <form onSubmit={handleCreateBusiness} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Business Name
            </label>
            <input
              type="text"
              id="name"
              value={newBusinessName}
              onChange={(e) => setNewBusinessName(e.target.value)}
              placeholder="Enter business name"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white p-2 border"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-purple-600 dark:bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <div className="space-y-2">
        {businesses.length === 0 ? (
          <div className="text-center py-8">
            <Store className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No businesses yet
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              Create your first business
            </button>
          </div>
        ) : (
          businesses.map((business) => (
            <button
              key={business.id}
              onClick={() => handleSelectBusiness(business)}
              className={`
                w-full text-left p-4 rounded-lg shadow-sm transition-all
                ${
                  activeBusiness?.id === business.id
                    ? "bg-purple-50 dark:bg-purple-900 border-2 border-purple-500 dark:border-purple-400"
                    : "bg-white dark:bg-gray-800 hover:shadow-md dark:hover:bg-gray-700"
                }
                relative
              `}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {business.name}
                {activeBusiness?.id === business.id && (
                  <CheckCircle
                    className="absolute top-4 right-4 text-purple-600 dark:text-purple-400"
                    size={20}
                  />
                )}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created on {new Date(business.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
