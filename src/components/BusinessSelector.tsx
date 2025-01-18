import { ChevronLeft, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useBusiness } from "../context/BusinessContext";
import ProfileDropdown from "./ProfileDropdown";
import { truncateText } from "../utils/stringUtils";
import { useIsMobile } from "../hooks/useBreakpoint";
import { BookIcon } from "./common/Icon";

export default function BusinessSelector() {
  const { activeBusiness, businesses } = useBusiness();
  const isMobile = useIsMobile();

  return (
    <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 fixed top-0 left-0 right-0 z-10">
      <div
        className={`${
          isMobile ? "max-w-md" : ""
        } mx-auto flex items-center px-4 justify-between h-14`}
      >
        <div className="flex items-center gap-4">
          {!isMobile && (
            <Link to="/" className="">
              <div className="flex items-center gap-1">
                <BookIcon className="h-[34px] text-purple-500" />
                <span className="text-3xl font-medium text-black dark:text-white font-crostan">
                  Cashio
                </span>
              </div>
            </Link>
          )}
          {activeBusiness ? (
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <div className="flex items-center gap-2 md:pl-[105px]">
                <ChevronLeft
                  size={18}
                  className="text-gray-600 dark:text-gray-300"
                />
                <Store size={20} className="text-gray-600 dark:text-gray-300" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {truncateText(activeBusiness.name, isMobile ? 16 : 21)}
                </span>
              </div>
            </Link>
          ) : (
            <div className="text-gray-600 dark:text-gray-300">
              <Store size={20} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-500 dark:text-gray-400">
            ({businesses.length}{" "}
            {businesses.length === 1 ? "business" : "businesses"})
          </Link>
          <div className="relative">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}
