import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import RevenueChart from "../components/RevenueChart";
import VendorChart from "../components/VendorChart";

export default function AdminDashboard() {

  const [recentUploads, setRecentUploads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [insights, setInsights] = useState([]);

  const [stats, setStats] = useState({
    revenue: 0,
    invoices: 0,
    users: 0,
    avg: 0
  });

  useEffect(() => {
  fetchRecentUploads();
  fetchStats();
  fetchInsights();
}, []);
  const fetchInsights = async () => {

  try {

    const res = await axios.get(
      "http://127.0.0.1:8000/invoice/insights",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setInsights(res.data.insights);

  } catch (error) {
    console.error("Insights fetch failed", error);
  }

};

  // =========================
  // FETCH ADMIN STATS
  // =========================
  const fetchStats = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/invoice/admin-stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setStats(res.data);

    } catch (error) {
      console.error("Stats fetch failed", error);
    }

  };

  // =========================
  // FETCH RECENT UPLOADS
  // =========================
  const fetchRecentUploads = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/invoice/history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const formatted = response.data.map((inv) => {

        let fields = {};

        if (inv.extracted_fields) {

          if (typeof inv.extracted_fields === "string") {

            try {
              fields = JSON.parse(inv.extracted_fields);
            } catch {
              fields = {};
            }

          } else {
            fields = inv.extracted_fields;
          }

        }

        return {
          id: inv.id,
          filename: inv.filename || "Unknown file",
          vendor: fields.vendor || "Unknown",
          date: inv.uploaded_at
            ? new Date(inv.uploaded_at).toLocaleDateString()
            : "—",
          amount: `$${parseFloat(fields.total || 0).toFixed(2)}`,
          status: "Processed"
        };

      });

      setRecentUploads(formatted);

    } catch (error) {
      console.error("Upload fetch failed", error);
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
            className="text-gray-700 hover:text-indigo-600 text-2xl"
          >
            ☰
          </button>

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

        </div>

        {/* ================= KPI CARDS ================= */}

        <div className="grid grid-cols-4 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold text-indigo-600">
              ${stats.revenue}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-gray-500">Invoices</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {stats.invoices}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-gray-500">Users</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {stats.users}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-gray-500">Avg Invoice</h3>
            <p className="text-3xl font-bold text-indigo-600">
              ${stats.avg}
            </p>
          </div>

        </div>

        {/* ================= REVENUE CHART ================= */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-10">

          <h2 className="text-lg font-semibold mb-4">
            Revenue Overview
          </h2>

          <div className="w-full h-[420px]">
            <RevenueChart />
          </div>

        </div>
        

        {/* ================= VENDOR PIE ================= */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-10">

          <h2 className="text-lg font-semibold mb-4">
            Top Vendors
          </h2>

          <div className="w-full h-[380px] flex items-center justify-center">
            <VendorChart />
          </div>

        </div>

        {/* ================= RECENT UPLOADS ================= */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-lg font-semibold mb-6">
            Recent Uploads
          </h2>

          <table className="w-full border border-gray-200">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">File</th>
                <th className="p-3 border">Vendor</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>

            <tbody>

              {recentUploads.length === 0 ? (

                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No uploads yet
                  </td>
                </tr>

              ) : (

                recentUploads.map((item) => (

                  <tr key={item.id} className="hover:bg-gray-50">

                    <td className="p-3 border">
                      {item.filename}
                    </td>

                    <td className="p-3 border">
                      {item.vendor}
                    </td>

                    <td className="p-3 border">
                      {item.date}
                    </td>

                    <td className="p-3 border">
                      {item.amount}
                    </td>

                    <td className="p-3 border text-green-600 font-medium">
                      {item.status}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">

<h2 className="text-lg font-semibold mb-4">
AI Spending Insights
</h2>

<div className="space-y-3">

{insights.length === 0 ? (

<p className="text-gray-500">
No insights available yet
</p>

) : (

insights.map((insight, index) => (

<div
key={index}
className="p-4 bg-indigo-50 rounded-lg border border-indigo-100"
>

<span className="font-medium text-indigo-700">
⚡ Insight:
</span>

<span className="ml-2 text-gray-700">
{insight}
</span>

</div>

))

)}

</div>

</div>

      </div>

    </div>

  );

}