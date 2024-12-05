import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BusinessProvider } from './context/BusinessContext';
import HomePage from './pages/HomePage';
import CashbookPage from './pages/CashbookPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import SuppliersPage from './pages/SuppliersPage';
import SupplierDetailPage from './pages/SupplierDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AllCustomersReportPage from './pages/AllCustomersReportPage';
import AllSuppliersReportPage from './pages/AllSuppliersReportPage';
import NavBar from './components/NavBar';
import BusinessSelector from './components/BusinessSelector';
import './index.css';

function App() {
  return (
    <BusinessProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <BusinessSelector />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cashbook" element={<CashbookPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:customerId" element={<CustomerDetailPage />} />
            <Route path="/customers/report" element={<AllCustomersReportPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/suppliers/:supplierId" element={<SupplierDetailPage />} />
            <Route path="/suppliers/report" element={<AllSuppliersReportPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
          <NavBar />
        </div>
      </Router>
    </BusinessProvider>
  );
}

export default App;