import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center justify-between bg-navy px-6 py-4 text-white">
        <div className="flex items-center gap-2 font-semibold">
          <span>🛡️</span> Ethics Officer Console
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/admin/dashboard" className="hover:text-accent">
            Dashboard
          </Link>
          <Link to="/admin/cases" className="hover:text-accent">
            Cases
          </Link>
          <Link to="/admin/settings" className="hover:text-accent">
            Settings
          </Link>
          <span className="text-white/70">{user?.name}</span>
          <button onClick={handleLogout} className="rounded bg-white/10 px-3 py-1 hover:bg-white/20">
            Logout
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
