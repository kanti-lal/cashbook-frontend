import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Users, TrendingUp, Truck } from "lucide-react";

export default function NavBar() {
  const location = useLocation();

  const getNavItemClass = (path: string) => {
    // Exact match for home route
    if (path === "/") {
      return `flex flex-col items-center p-2 ${
        location.pathname === "/"
          ? "text-purple-600 dark:text-purple-400"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      }`;
    }

    // For other routes, check if current path starts with the nav item path
    return `flex flex-col items-center p-2 ${
      location.pathname.startsWith(path)
        ? "text-purple-600 dark:text-purple-400"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
    }`;
  };

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
