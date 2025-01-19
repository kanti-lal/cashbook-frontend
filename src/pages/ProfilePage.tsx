import { useProfile } from "../hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Phone, MapPin, Calendar, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const navigate = useNavigate();

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
    <div className="max-w-md md:max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="relative h-[120px] md:h-[200px] bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700">
          <div className="absolute -bottom-12 md:-bottom-16 left-6 md:left-12">
            <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
              <span className="text-5xl md:text-7xl font-semibold text-purple-500">
                {profile?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 md:pt-24 px-4 md:px-12 pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                {profile?.name}
              </h1>
              <p className="text-purple-600 font-medium">{profile?.email}</p>
            </div>
            <button
              onClick={() => navigate("/profile/edit")}
              className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors duration-200 hover:shadow-md"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
