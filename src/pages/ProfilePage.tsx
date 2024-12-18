import { useProfile } from "../hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Phone, MapPin, Calendar, Mail, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  const ProfileItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-white shadow-sm">
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5 text-purple-500" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8  min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="relative h-[80px] bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="absolute -bottom-8 left-6">
            <div className="w-[80px] h-[80px] rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
              <span className="text-5xl font-semibold text-purple-500">
                {profile?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-4 pb-2 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.name}
            </h1>
            <button
              onClick={() => navigate("/profile/edit")}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1  gap-4">
            <ProfileItem icon={Mail} label="Email" value={profile?.email} />
            <ProfileItem
              icon={Phone}
              label="Mobile"
              value={profile?.mobile || "Not provided"}
            />
            <ProfileItem
              icon={MapPin}
              label="Address"
              value={profile?.address || "Not provided"}
            />
            <ProfileItem
              icon={Calendar}
              label="Date of Birth"
              value={
                profile?.dateOfBirth
                  ? format(new Date(profile.dateOfBirth), "MMMM d, yyyy")
                  : "Not provided"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
