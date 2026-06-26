import { useEffect, useState } from "react";
import * as adminApi from "../../api/adminApi";

interface Officer {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface AuditLogRow {
  id: string;
  action: string;
  createdAt: string;
  user: { name: string } | null;
}

export default function Settings() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [logs, setLogs] = useState<AuditLogRow[]>([]);

  useEffect(() => {
    adminApi.getOfficers().then(setOfficers);
    adminApi.getAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-600">Ethics Officers</h2>
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((o) => (
              <tr key={o.id} className="border-t border-gray-100">
                <td className="py-2">{o.name}</td>
                <td className="py-2">{o.email}</td>
                <td className="py-2">{o.role}</td>
                <td className="py-2">{o.isActive ? "Active" : "Disabled"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-600">Audit Log</h2>
        <div className="mt-3 max-h-80 space-y-2 overflow-y-auto text-sm">
          {logs.map((log) => (
            <div key={log.id} className="flex justify-between border-b border-gray-100 pb-2">
              <span>
                {log.user?.name ?? "System"} — {log.action}
              </span>
              <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
