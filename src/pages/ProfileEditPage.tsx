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
  } = useForm<UpdateProfileData>({
    values: {
      name: profile?.name || "",
      mobile: profile?.mobile || "",
      address: profile?.address || "",
      dateOfBirth: profile?.dateOfBirth || "",
    },
  });

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

  const InputField = ({ label, error, ...props }: any) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        className={`w-full px-4 py-2 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );

  return (
    <div className=" max-w-md mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            label="Name"
            type="text"
            defaultValues={profile?.name}
            {...register("name", { required: "Name is required" })}
            error={errors.name}
          />

          <InputField
            label="Mobile"
            type="tel"
            defaultValues={profile?.mobile}
            {...register("mobile")}
            error={errors.mobile}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={1}
              {...register("address")}
            />
          </div>

          <InputField
            label="Date of Birth"
            type="date"
            defaultValues={profile?.dateOfBirth}
            {...register("dateOfBirth")}
            error={errors.dateOfBirth}
          />

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
