import { useState } from "react";
import toast from "react-hot-toast";
import { trackReport } from "../../api/reportApi";
import { STATUS_LABELS } from "../../utils/constants";

interface TrackResult {
  reportRef: string;
  status: string;
  submittedAt: string;
  timeline: { status: string; at: string }[];
}

export default function Track() {
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);

  async function handleLookup() {
    if (!ref.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await trackReport(ref.trim());
      setResult(data);
    } catch {
      toast.error("Report not found. Check the reference ID and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold text-navy">Track Your Report</h1>
      <p className="mt-1 text-sm text-gray-500">Enter the reference ID you received at submission.</p>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2"
          placeholder="ETH-2026-XXXXX"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
        />
        <button onClick={handleLookup} disabled={loading} className="rounded-lg bg-navy px-5 py-2 font-semibold text-white">
          {loading ? "..." : "Track"}
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-gray-500">{result.reportRef}</span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {STATUS_LABELS[result.status] ?? result.status}
            </span>
          </div>
          <ol className="mt-5 space-y-3 border-l border-gray-200 pl-4">
            {result.timeline.map((event, idx) => (
              <li key={idx} className="relative text-sm">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="font-medium text-navy">{STATUS_LABELS[event.status] ?? event.status}</span>
                <span className="ml-2 text-gray-400">{new Date(event.at).toLocaleString()}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
