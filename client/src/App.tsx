import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Landing from "./pages/Landing/Landing";
import ReportForm from "./pages/Report/ReportForm";
import Track from "./pages/Track/Track";
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import Cases from "./pages/Admin/Cases";
import CaseDetail from "./pages/Admin/CaseDetail";
import Settings from "./pages/Admin/Settings";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/track" element={<Track />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/cases" element={<Cases />} />
            <Route path="/admin/cases/:id" element={<CaseDetail />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
