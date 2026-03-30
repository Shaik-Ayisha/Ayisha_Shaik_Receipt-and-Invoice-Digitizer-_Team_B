import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // 🔥 active link highlight
  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-slate-700"
        : "hover:bg-slate-700"
    }`;

  return (

    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col justify-between p-6">

      {/* Top Section */}
      <div>

        {/* Admin Title */}
        <div className="mb-10">

          <Link to="/admin">
  <h1 className="text-2xl font-bold tracking-wide cursor-pointer hover:text-gray-300">
    Admin Panel
  </h1>
</Link>

          <p className="text-sm text-gray-400">
            Administrator
          </p>

        </div>

        {/* Navigation */}
        <ul className="space-y-3">

          <li>
            <Link to="/invoices" className={linkClass("/invoices")}>
              🧾 Invoices
            </Link>
          </li>

          <li>
            <Link to="/users" className={linkClass("/users")}>
              👥 Users
            </Link>
          </li>

          <li>
            <Link to="/reports" className={linkClass("/reports")}>
              📊 Reports
            </Link>
          </li>

          <li>
            <Link to="/settings" className={linkClass("/settings")}>
              ⚙️ Settings
            </Link>
          </li>

          <li>
            <Link to="/privacy" className={linkClass("/privacy")}>
              🔐 Privacy
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