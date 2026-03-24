import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (

    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col justify-between p-6">

      {/* Top Section */}
      <div>

        {/* Admin Title */}
        <div className="mb-10">

          <h1 className="text-2xl font-bold tracking-wide">
            Admin Panel
          </h1>

          <p className="text-sm text-gray-400">
            Administrator
          </p>

        </div>

        {/* Navigation */}
        <ul className="space-y-3">

          <li>
            <Link
              to="/admin"
              className="block px-4 py-2 rounded-lg hover:bg-slate-700 transition"
            >
              📊 Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/invoices"
              className="block px-4 py-2 rounded-lg hover:bg-slate-700 transition"
            >
              🧾 Invoices
            </Link>
          </li>

          <li>
            <Link
              to="/users"
              className="block px-4 py-2 rounded-lg hover:bg-slate-700 transition"
            >
              👥 Users
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              className="block px-4 py-2 rounded-lg hover:bg-slate-700 transition"
            >
              ⚙️ Settings
            </Link>
          </li>

        </ul>

      </div>

      {/* Bottom Section */}
      <div>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          🚪 Logout
        </button>

      </div>

    </div>

  );

}