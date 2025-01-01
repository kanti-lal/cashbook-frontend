import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_is_authenticated");
    navigate("/admin/login");
  };

  return (
    <div className="w-64 bg-gray-800 h-screen fixed left-0 top-0">
      <div className="p-4">
        <h2 className="text-white text-xl font-semibold">Admin Panel</h2>
      </div>
      <nav className="mt-8">
        <a
          href="/admin/dashboard"
          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700"
        >
          <span className="mx-3">Dashboard</span>
        </a>
        <a
          href="/admin/users"
          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700"
        >
          <span className="mx-3">Users</span>
        </a>
        <button
          onClick={handleAdminLogout}
          className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700"
        >
          <span className="mx-3">Logout</span>
        </button>
        {/* Add more menu items as needed */}
      </nav>
    </div>
  );
};

export default function AdminLayout() {
  const { isAdminAuthenticated } = useAdmin();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full min-h-screen bg-gray-100 p-8">
        <Outlet />
      </div>
    </div>
  );
}
