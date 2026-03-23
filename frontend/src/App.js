import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";   // ✅ NEW
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Users from "./pages/Users";
import InvoiceDetails from "./pages/InvoiceDetails";
import AdminLogin from "./pages/AdminLogin";
import Reports from "./pages/Reports";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Login Page */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Invoice Pages */}
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoicedetails" element={<InvoiceDetails />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
         <Route path="/settings" element={<Settings />} />
         <Route path="/reports" element={<Reports />} />

        {/* Users Page */}
        <Route path="/users" element={<Users />} />

      </Routes>
    </Router>
  );
}

export default App;