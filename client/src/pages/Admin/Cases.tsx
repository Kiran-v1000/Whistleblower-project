import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as adminApi from "../../api/adminApi";
import { CATEGORIES, SEVERITIES, STATUS_LABELS } from "../../utils/constants";

interface CaseRow {
  id: string;
  reportRef: string;
  category: string;
  severity: string;
  status: string;
  department: string | null;
  isAnonymous: boolean;
  assignedTo: { name: string } | null;
  createdAt: string;
}

export default function Cases() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", severity: "", status: "" });

  async function load() {
    setLoading(true);
    const cleaned = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const data = await adminApi.listReports(cleaned);
    setCases(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filters]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-navy">All Cases</h1>

      <div className="flex gap-3">
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={filters.severity}
          onChange={(e) => setFilters((f) => ({ ...f, severity: e.target.value }))}
        >
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-bg text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-gray-400" colSpan={6}>
                  Loading...
                </td>
              </tr>
            )}
            {!loading && cases.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-gray-400" colSpan={6}>
                  No cases match these filters.
                </td>
              </tr>
            )}
            {cases.map((c) => (
              <tr key={c.id} className="border-t border-gray-100 hover:bg-bg">
                <td className="px-4 py-3">
                  <Link to={`/admin/cases/${c.id}`} className="font-mono text-accent">
                    {c.reportRef}
                  </Link>
                </td>
                <td className="px-4 py-3">{c.category.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">{c.severity}</td>
                <td className="px-4 py-3">{STATUS_LABELS[c.status] ?? c.status}</td>
                <td className="px-4 py-3">{c.assignedTo?.name ?? "Unassigned"}</td>
                <td className="px-4 py-3">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
