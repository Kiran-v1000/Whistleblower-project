import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-hero-gradient text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">🛡️</span>
            Ethics & Compliance Portal
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link to="/report" className="hover:text-accent">
              Submit Report
            </Link>
            <Link to="/track" className="hover:text-accent">
              Track Status
            </Link>
            <Link to="/admin/login" className="hover:text-accent">
              Ethics Officer
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
