import { useEffect, useState } from "react";
import axios from "axios";

function Users() {

  const [users, setUsers] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchInvoices();
  }, []);

  const fetchUsers = async () => {
    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers(res.data);

    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const toggleUserStatus = async (id, isActive) => {

  try {

    const endpoint = isActive
      ? `/users/${id}/deactivate`
      : `/users/${id}/activate`;

    await axios.put(
      `http://127.0.0.1:8000${endpoint}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    fetchUsers();

  } catch (err) {
    console.error("Status change failed", err);
  }

};

  const fetchInvoices = async () => {
    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/invoice/history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setInvoiceData(res.data);

    } catch (err) {
      console.error("Failed to fetch invoices", err);
    }
  };

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      await axios.delete(
        `http://127.0.0.1:8000/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers(users.filter(u => u.id !== id));

    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // invoices per user
  const getUserInvoiceCount = (userId) => {
    return invoiceData.filter(inv => inv.user_id === userId).length;
  };

  // revenue per user
  const getUserRevenue = (userId) => {

    const userInvoices = invoiceData.filter(inv => inv.user_id === userId);

    let total = 0;

    userInvoices.forEach(inv => {

      if (!inv.extracted_fields) return;

      let fields = {};

      try {

        if (typeof inv.extracted_fields === "string") {
          fields = JSON.parse(inv.extracted_fields);
        } else {
          fields = inv.extracted_fields;
        }

        total += parseFloat(fields.total || 0);

      } catch {
        console.warn("Invalid extracted_fields format");
      }

    });

    return `$${total.toFixed(2)}`;
  };

  return (

    <div className="p-10 bg-slate-100 min-h-screen">

      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        User Accounts
      </h2>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">

        <div className="overflow-x-auto">

          <table className="w-full text-left border border-gray-200">

            {/* Header */}
            <thead className="bg-slate-900 text-white text-sm uppercase">

              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Invoices</th>
                <th className="p-4">Revenue</th>
                <th className="p-4 text-center">Actions</th>
              </tr>

            </thead>

            {/* Body */}
            <tbody className="text-gray-700">

              {users.length === 0 ? (

                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No users found
                  </td>
                </tr>

              ) : (

                users.map((u) => (

                  <tr key={u.id} className="border-t hover:bg-gray-50">

                    <td className="p-4">
                      {u.email}
                    </td>

                    <td className="p-4">
                      {getUserInvoiceCount(u.id)}
                    </td>

                    <td className="p-4 font-medium text-indigo-600">
                      {getUserRevenue(u.id)}
                    </td>

                    <td className="p-4 text-center">

                      {/* NEW ACTIVE / DEACTIVATE BUTTON */}

                      <button
  onClick={() => toggleUserStatus(u.id, u.is_active)}
  className="mr-3 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
>
  {u.is_active ? "Deactivate" : "Activate"}
</button>

                      {/* EXISTING DELETE BUTTON */}

                      <button
                        onClick={() => deleteUser(u.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default Users;