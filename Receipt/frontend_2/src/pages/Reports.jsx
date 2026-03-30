import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function Reports() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);

  // ✅ FIXED LINE
  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    avgValue: 0,
    maxInvoice: 0
  });

  const [vendors, setVendors] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/invoice/recent-ai",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const invoices = res.data;

      let totalRevenue = 0;
      let maxInvoice = 0;
      const vendorMap = {};
      const monthlyMap = {};

      invoices.forEach(item => {

        const amount = parseFloat(item.amount || 0);
        totalRevenue += amount;

        if (amount > maxInvoice) maxInvoice = amount;

        // Vendor aggregation
        vendorMap[item.vendor] = (vendorMap[item.vendor] || 0) + amount;

        // Month aggregation
        const month = new Date(item.date).toLocaleString("default", { month: "short" });
        monthlyMap[month] = (monthlyMap[month] || 0) + amount;

      });

      setSummary({
        totalInvoices: invoices.length,
        totalRevenue,
        avgValue: invoices.length ? totalRevenue / invoices.length : 0,
        maxInvoice
      });

      // Vendor ranking
      const sortedVendors = Object.entries(vendorMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      setVendors(sortedVendors);

      // Revenue trend
      const trend = Object.entries(monthlyMap).map(([label, revenue]) => ({
        label,
        revenue
      }));

      setRevenueTrend(trend);

      setData(invoices);

    } catch (err) {
      console.error("Report fetch failed", err);
    }

  };

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed w-64 h-screen">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 p-8 ${sidebarOpen ? "ml-64" : ""}`}>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl"
          >
            ☰
          </button>

          <h1 className="text-3xl font-bold">Reports</h1>

        </div>

        {/* 🔥 Stats */}
        <div className="grid grid-cols-4 gap-6 mb-10">

          <Card title="Total Invoices" value={summary.totalInvoices} />
          <Card title="Total Revenue" value={`$${summary.totalRevenue.toFixed(2)}`} />
          <Card title="Average Value" value={`$${summary.avgValue.toFixed(2)}`} />
          <Card title="Highest Invoice" value={`$${summary.maxInvoice.toFixed(2)}`} />

        </div>

        {/* 📈 Revenue Trend */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">

          <h2 className="font-semibold mb-4">Revenue Trend</h2>

          <LineChart width={600} height={250} data={revenueTrend}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#6366f1" />
          </LineChart>

        </div>

        {/* 🧁 Top Vendors */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">

          <h2 className="font-semibold mb-4">Top Vendors</h2>

          {vendors.length === 0 ? (
            <p className="text-gray-500">No vendor data</p>
          ) : (
            vendors.slice(0, 5).map((v, i) => (
              <div key={i} className="flex justify-between py-2 border-b">
                <span>{v.name}</span>
                <span className="font-medium">${v.value.toFixed(2)}</span>
              </div>
            ))
          )}

        </div>

        {/* ⚠️ Insights */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-semibold mb-4">Insights</h2>

          {vendors.length > 0 && (
            <p>🏆 Top Vendor: {vendors[0].name}</p>
          )}

          <p>📊 Total Revenue Generated: ${summary.totalRevenue.toFixed(2)}</p>

          <p>💰 Highest Invoice: ${summary.maxInvoice.toFixed(2)}</p>

        </div>

      </div>

    </div>

  );
}


// 🔥 Reusable Card Component
function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}