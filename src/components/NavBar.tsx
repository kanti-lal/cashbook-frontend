import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Users, TrendingUp, Truck } from "lucide-react";
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
    return `flex items-center gap-3 px-4 py-3 w-full ${
      isActive
        ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
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
    <nav className="w-64 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 fixed left-0 top-14">
      <div className="flex flex-col py-4">
        <Link to="/" className={getNavItemClass("/")}>
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link to="/cashbook" className={getNavItemClass("/cashbook")}>
          <BookOpen size={20} />
          <span>Cashbook</span>
        </Link>

        <Link to="/customers" className={getNavItemClass("/customers")}>
          <Users size={20} />
          <span>Customers</span>
        </Link>

        <Link to="/suppliers" className={getNavItemClass("/suppliers")}>
          <Truck size={20} />
          <span>Suppliers</span>
        </Link>

        <Link to="/analytics" className={getNavItemClass("/analytics")}>
          <TrendingUp size={20} />
          <span>Analytics</span>
        </Link>
      </div>
    </nav>
  );
}
