import { ChevronLeft, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useBusiness } from "../context/BusinessContext";
import ProfileDropdown from "./ProfileDropdown";

export default function BusinessSelector() {
  const { activeBusiness, businesses } = useBusiness();

  return (
    <div className="bg-white border-b fixed top-0 left-0 right-0 z-10">
      <div className="max-w-md mx-auto px-4 flex items-center justify-between h-14">
        {activeBusiness ? (
          <div className="flex justify-center flex-col">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft size={20} />
              <div className="flex items-center gap-2">
                <Store size={20} />
                <span className="font-medium">
                  {activeBusiness.name.slice(0, 17) + ".."}
                </span>
              </div>
              <div className="text-xs text-gray-500 pl-14">
                ({businesses.length}{" "}
                {businesses.length === 1 ? "business" : "businesses"})
              </div>
            </Link>
          </div>
        ) : (
          <div className="text-gray-600">
            <Store size={20} />
          </div>
        )}

        <div className="relative">
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}
