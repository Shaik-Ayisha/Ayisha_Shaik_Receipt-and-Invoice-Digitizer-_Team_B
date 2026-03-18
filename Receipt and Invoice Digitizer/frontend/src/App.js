import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Users from "./pages/Users";
import InvoiceDetails from "./pages/InvoiceDetails";
import AdminLogin from "./pages/AdminLogin";   // ✅ NEW

function App() {
  return (
    <Router>
      <Routes>

        {/* Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin Login Page */}
        <Route path="/admin-login" element={<AdminLogin />} />   {/* ✅ NEW */}

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Invoice Pages */}
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoicedetails" element={<InvoiceDetails />} />

        {/* Users Page */}
        <Route path="/users" element={<Users />} />

      </Routes>
    </Router>
  );
}

export default App;