import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Users, TrendingUp, Truck, Mail } from "lucide-react";
import { useIsMobile } from "../hooks/useBreakpoint";

export default function NavBar() {
  const location = useLocation();
  const isMobile = useIsMobile();

  const getNavItemClass = (path: string) => {
    const isActive =
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path);

    if (isMobile) {
      // Mobile styles (unchanged)
      return `flex flex-col items-center p-2 ${
        isActive
          ? "text-purple-600 dark:text-purple-400"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      }`;
    }

    // Desktop styles
    return `flex items-center gap-3 px-4 py-3 w-full transition-all duration-200 ${
      isActive
        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-l-4 border-purple-500 font-medium"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-purple-500 dark:hover:text-purple-400"
    }`;
  };

  if (isMobile) {
    // Mobile layout (unchanged)
    return (
      <nav className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-1">
            <Link to="/" className={getNavItemClass("/")}>
              <Home size={24} />
              <span className="text-xs">Home</span>
            </Link>

            <Link to="/cashbook" className={getNavItemClass("/cashbook")}>
              <BookOpen size={24} />
              <span className="text-xs">Cashbook</span>
            </Link>

            <Link to="/customers" className={getNavItemClass("/customers")}>
              <Users size={24} />
              <span className="text-xs">Customers</span>
            </Link>

            <Link to="/suppliers" className={getNavItemClass("/suppliers")}>
              <Truck size={24} />
              <span className="text-xs">Suppliers</span>
            </Link>

            <Link to="/analytics" className={getNavItemClass("/analytics")}>
              <TrendingUp size={24} />
              <span className="text-xs">Analytics</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Desktop layout
  return (
    <nav className="w-64 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 fixed left-0 top-14 shadow-sm">
      <div className="flex flex-col py-6 space-y-2">
        <Link to="/" className={getNavItemClass("/")}>
          <Home size={20} className="min-w-[20px]" />
          <span className="font-medium">Home</span>
        </Link>

        <Link to="/cashbook" className={getNavItemClass("/cashbook")}>
          <BookOpen size={20} className="min-w-[20px]" />
          <span className="font-medium">Cashbook</span>
        </Link>

        <Link to="/customers" className={getNavItemClass("/customers")}>
          <Users size={20} className="min-w-[20px]" />
          <span className="font-medium">Customers</span>
        </Link>

        <Link to="/suppliers" className={getNavItemClass("/suppliers")}>
          <Truck size={20} className="min-w-[20px]" />
          <span className="font-medium">Suppliers</span>
        </Link>

        <Link to="/analytics" className={getNavItemClass("/analytics")}>
          <TrendingUp size={20} className="min-w-[20px]" />
          <span className="font-medium">Analytics</span>
        </Link>

        <Link to="/contact" className={getNavItemClass("/contact")}>
          <Mail size={20} className="min-w-[20px]" />
          <span className="font-medium">Contact</span>
        </Link>
      </div>
      <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6 absolute bottom-10 mx-auto w-full">
        &copy; {new Date().getFullYear()} Cashio. All rights reserved.
      </p>
    </nav>
  );
}
