import { useState } from "react";
import { updateSupplier } from "../utils/storage";
import { AlertCircle } from "lucide-react";
import SuccessAnimation from "./SuccessAnimation";
import { Supplier } from "../types";

interface ValidationErrors {
  name?: string;
  phoneNumber?: string;
}

interface EditSupplierFormProps {
  supplier: Supplier;
  onComplete: () => void;
}

export default function EditSupplierForm({
  supplier,
  onComplete,
}: EditSupplierFormProps) {
  const [name, setName] = useState(supplier.name);
  const [phoneNumber, setPhoneNumber] = useState(supplier.phoneNumber);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

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

    if (!validateForm()) return;

    updateSupplier({
      ...supplier,
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
    });

    setShowSuccess(true);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(value);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    onComplete();
  };

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
          className="block text-sm font-medium text-gray-700"
        >
          Supplier Name*
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } focus:border-purple-500 focus:ring-purple-500`}
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
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number*
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
            errors.phoneNumber ? "border-red-500" : "border-gray-300"
          } focus:border-purple-500 focus:ring-purple-500`}
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
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-300"
        disabled={!name.trim() || !phoneNumber.trim()}
      >
        Save Changes
      </button>
    </form>
  );
}
