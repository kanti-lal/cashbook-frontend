import { Navigate, Route, Routes } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLogin from "../pages/admin/AdminLogin";

export function AdminRoutes() {
  const { isAdminAuthenticated } = useAdmin();

  if (!isAdminAuthenticated) {
    return (
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="*" element={<Navigate to="login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* Add more admin routes here */}
      </Route>
    </Routes>
  );
}
