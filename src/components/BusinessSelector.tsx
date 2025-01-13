import { ChevronLeft, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useBusiness } from "../context/BusinessContext";
import ProfileDropdown from "./ProfileDropdown";
import { truncateText } from "../utils/stringUtils";
import { useIsMobile } from "../hooks/useBreakpoint";

export default function BusinessSelector() {
  const { activeBusiness, businesses } = useBusiness();
  const isMobile = useIsMobile();

  return (
    <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 fixed top-0 left-0 right-0 z-10">
      <div className="max-w-md mx-auto px-4 flex items-center justify-between h-14">
        {activeBusiness ? (
          <div className="flex justify-center flex-col">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeft size={20} />
              <div className="flex items-center gap-2">
                <Store size={20} />
                <span className="font-medium">
                  {truncateText(activeBusiness.name, isMobile ? 16 : 21)}
                </span>
              </div>
            </Link>
          </div>
        ) : (
          <div className="text-gray-600 dark:text-gray-300">
            <Store size={20} />
          </div>
        )}
        <div className="flex items-center gap-2">
          {businesses.length === 0 ? (
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ({businesses.length} {"business"})
              </div>
            </Link>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ({businesses.length}{" "}
                {businesses.length === 1 ? "business" : "businesses"})
              </div>
            </Link>
          )}
          <div className="relative">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}
