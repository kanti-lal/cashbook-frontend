// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import { BusinessProvider } from "./context/BusinessContext";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import HomePage from "./pages/HomePage";
// import CashbookPage from "./pages/CashbookPage";
// import CustomersPage from "./pages/CustomersPage";
// import CustomerDetailPage from "./pages/CustomerDetailPage";
// import SuppliersPage from "./pages/SuppliersPage";
// import SupplierDetailPage from "./pages/SupplierDetailPage";
// import AnalyticsPage from "./pages/AnalyticsPage";
// import AllCustomersReportPage from "./pages/AllCustomersReportPage";
// import AllSuppliersReportPage from "./pages/AllSuppliersReportPage";
// import NavBar from "./components/NavBar";
// import BusinessSelector from "./components/BusinessSelector";
// import "./index.css";
// import ProfilePage from "./pages/ProfilePage";
// import ProfileEditPage from "./pages/ProfileEditPage";
// import TransactionDetailPage from "./pages/TransactionDetailPage";
// import { ThemeProvider } from "./context/ThemeContext";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";

// function ProtectedLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Fixed Header */}
//       <BusinessSelector />

//       {/* Main Content with padding for header and navbar */}
//       <main className="flex-1 max-w-md w-full mx-auto px-4 pt-14 pb-16">
//         {children}
//       </main>

//       {/* Fixed Bottom Navigation */}
//       <div className="fixed bottom-0 left-0 right-0 z-10">
//         <NavBar />
//       </div>
//     </div>
//   );
// }

// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   return <ProtectedLayout>{children}</ProtectedLayout>;
// }

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <BusinessProvider>
//           <Router>
//             <Routes>
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/register" element={<RegisterPage />} />

//               <Route
//                 path="/"
//                 element={
//                   <ProtectedRoute>
//                     <HomePage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/cashbook"
//                 element={
//                   <ProtectedRoute>
//                     <CashbookPage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/transactions/:transactionId"
//                 element={
//                   <ProtectedRoute>
//                     <TransactionDetailPage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/customers"
//                 element={
//                   <ProtectedRoute>
//                     <CustomersPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/customers/:customerId"
//                 element={
//                   <ProtectedRoute>
//                     <CustomerDetailPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/customers/report"
//                 element={
//                   <ProtectedRoute>
//                     <AllCustomersReportPage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/suppliers"
//                 element={
//                   <ProtectedRoute>
//                     <SuppliersPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/suppliers/:supplierId"
//                 element={
//                   <ProtectedRoute>
//                     <SupplierDetailPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/suppliers/report"
//                 element={
//                   <ProtectedRoute>
//                     <AllSuppliersReportPage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/profile"
//                 element={
//                   <ProtectedRoute>
//                     <ProfilePage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/profile/edit"
//                 element={
//                   <ProtectedRoute>
//                     <ProfileEditPage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="/analytics"
//                 element={
//                   <ProtectedRoute>
//                     <AnalyticsPage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//               <Route path="/reset-password" element={<ResetPasswordPage />} />
//             </Routes>
//           </Router>
//         </BusinessProvider>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BusinessProvider } from "./context/BusinessContext";
import { ThemeProvider } from "./context/ThemeContext";
import BusinessSelector from "./components/BusinessSelector";
import NavBar from "./components/NavBar";
import "./index.css";

// Lazy load all pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const CashbookPage = lazy(() => import("./pages/CashbookPage"));
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const CustomerDetailPage = lazy(() => import("./pages/CustomerDetailPage"));
const SuppliersPage = lazy(() => import("./pages/SuppliersPage"));
const SupplierDetailPage = lazy(() => import("./pages/SupplierDetailPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const AllCustomersReportPage = lazy(
  () => import("./pages/AllCustomersReportPage")
);
const AllSuppliersReportPage = lazy(
  () => import("./pages/AllSuppliersReportPage")
);
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProfileEditPage = lazy(() => import("./pages/ProfileEditPage"));
const TransactionDetailPage = lazy(
  () => import("./pages/TransactionDetailPage")
);
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BusinessSelector />
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-14 pb-16">
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <NavBar />
      </div>
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
    <ThemeProvider>
      <AuthProvider>
        <BusinessProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
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
                  path="/transactions/:transactionId"
                  element={
                    <ProtectedRoute>
                      <TransactionDetailPage />
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
                  path="/profile/edit"
                  element={
                    <ProtectedRoute>
                      <ProfileEditPage />
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

                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Routes>
            </Suspense>
          </Router>
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
