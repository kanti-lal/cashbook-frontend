import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BusinessProvider } from "./context/BusinessContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CashbookPage from "./pages/CashbookPage";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import SuppliersPage from "./pages/SuppliersPage";
import SupplierDetailPage from "./pages/SupplierDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AllCustomersReportPage from "./pages/AllCustomersReportPage";
import AllSuppliersReportPage from "./pages/AllSuppliersReportPage";
import NavBar from "./components/NavBar";
import BusinessSelector from "./components/BusinessSelector";
import "./index.css";
import ProfilePage from "./pages/ProfilePage";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessSelector />
      {children}
      <NavBar />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
}

function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cashbook"
              element={
                <ProtectedRoute>
                  <CashbookPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <CustomersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/:customerId"
              element={
                <ProtectedRoute>
                  <CustomerDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/report"
              element={
                <ProtectedRoute>
                  <AllCustomersReportPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/suppliers"
              element={
                <ProtectedRoute>
                  <SuppliersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers/:supplierId"
              element={
                <ProtectedRoute>
                  <SupplierDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers/report"
              element={
                <ProtectedRoute>
                  <AllSuppliersReportPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </BusinessProvider>
    </AuthProvider>
  );
}

export default App;
