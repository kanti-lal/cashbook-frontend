import { useEffect, forwardRef } from "react";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UpdateProfileData } from "../api/auth";
import { ArrowLeft } from "lucide-react";

export default function ProfileEditPage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileData>();

  useEffect(() => {
    if (profile) {
      // Prefill the form with profile data
      reset({
        name: profile.name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
        address: profile.address || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: UpdateProfileData) => {
    updateProfile.mutate(data, {
      onSuccess: () => navigate("/profile"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  const InputField = forwardRef(({ label, error, ...props }: any, ref) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        ref={ref}
        className={`w-full px-4 py-2 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  ));

  // Optional: Add display name for better debugging
  InputField.displayName = "InputField";

  return (
    <div className="max-w-md md:max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12">
        <div className="flex items-center space-x-4 mb-8 md:mb-12">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Edit Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-3xl">
          <InputField
            label="Name"
            type="text"
            {...register("name", { required: "Name is required" })}
            error={errors.name}
          />

          <InputField
            label="Email"
            type="email"
            {...register("email")}
            disabled={true}
            error={errors.email}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Mobile"
              type="tel"
              {...register("mobile")}
              error={errors.mobile}
            />

            <InputField
              label="Date of Birth"
              type="date"
              placeholder="DD-MM-YYYY"
              {...register("dateOfBirth")}
              error={errors.dateOfBirth}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              {...register("address")}
            />
          </div>

          <div className="flex space-x-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-1 md:px-6 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md hover:shadow-lg"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
