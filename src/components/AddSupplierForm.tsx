import { useState } from "react";
import { AlertCircle } from "lucide-react";
import SuccessAnimation from "./SuccessAnimation";
import { useBusiness } from "../context/BusinessContext";
import { Supplier } from "../types";

interface ValidationErrors {
  name?: string;
  phoneNumber?: string;
}

export default function AddSupplierForm({
  onAdd,
}: {
  onAdd: (supplierData: Supplier) => void;
}) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const { activeBusiness } = useBusiness();

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !activeBusiness) return;

    // saveSupplier({
    //   id: Date.now().toString(),
    //   name: name.trim(),
    //   phoneNumber: phoneNumber.trim(),
    //   balance: 0,
    //   businessId: activeBusiness.id,
    // });

    onAdd({
      id: Date.now().toString(),
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      balance: 0,
      businessId: activeBusiness.id,
    });

    setName("");
    setPhoneNumber("");
    setErrors({});
    setShowSuccess(true);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(value);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // onAdd();
  };

  if (!activeBusiness) {
    return (
      <div className="text-red-600 text-center p-4">
        Please select a business first
      </div>
    );
  }

  if (showSuccess) {
    return (
      <SuccessAnimation onComplete={handleSuccessComplete} inModal={true} />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Supplier Name*
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm p-2 border bg-white dark:bg-gray-700 ${
            errors.name
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } focus:border-purple-500 focus:ring-purple-500 dark:text-gray-100`}
          placeholder="Enter supplier name"
        />
        {errors.name && (
          <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={16} />
            {errors.name}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Phone Number*
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className={`mt-1 block w-full rounded-md shadow-sm p-2 border bg-white dark:bg-gray-700 ${
            errors.phoneNumber
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } focus:border-purple-500 focus:ring-purple-500 dark:text-gray-100`}
          placeholder="Enter 10-digit phone number"
        />
        {errors.phoneNumber && (
          <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={16} />
            {errors.phoneNumber}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-300 dark:disabled:bg-purple-900"
        disabled={!name.trim() || !phoneNumber.trim()}
      >
        Add Supplier
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        * Required fields
      </p>
    </form>
  );
}
