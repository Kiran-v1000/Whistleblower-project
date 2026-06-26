import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import * as adminApi from "../../api/adminApi";

interface Stats {
  total: number;
  open: number;
  underReview: number;
  resolved: number;
  avgResolutionDays: number;
  byCategory: { category: string; count: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminApi.getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <div className="text-gray-400">Loading dashboard...</div>;

  const cards = [
    { label: "Total Reports", value: stats.total },
    { label: "Open", value: stats.open },
    { label: "Under Review", value: stats.underReview },
    { label: "Resolved", value: stats.resolved },
    { label: "Avg. Resolution (days)", value: stats.avgResolutionDays },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-xs uppercase text-gray-400">{c.label}</p>
            <p className="mt-2 text-2xl font-bold text-navy">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-600">Reports by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.byCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B8BD4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
