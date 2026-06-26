import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import * as adminApi from "../../api/adminApi";
import { STATUS_LABELS } from "../../utils/constants";

interface Note {
  id: string;
  body: string;
  createdAt: string;
  author: { name: string };
}

interface CaseDetailData {
  id: string;
  reportRef: string;
  category: string;
  severity: string;
  status: string;
  department: string | null;
  location: string | null;
  description: string;
  isAnonymous: boolean;
  reporterEmail: string | null;
  outcome: string | null;
  files: { id: string; originalName: string }[];
  notes: Note[];
  statusLog: { status: string; createdAt: string }[];
}

export default function CaseDetail() {
  const { id } = useParams();
  const [data, setData] = useState<CaseDetailData | null>(null);
  const [note, setNote] = useState("");

  async function load() {
    if (!id) return;
    const result = await adminApi.getReportDetail(id);
    setData(result);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleStatusChange(status: string) {
    if (!id) return;
    await adminApi.updateReport(id, { status });
    toast.success("Status updated");
    load();
  }

  async function handleAddNote() {
    if (!id || !note.trim()) return;
    await adminApi.addNote(id, note.trim());
    setNote("");
    load();
  }

  if (!data) return <div className="text-gray-400">Loading case...</div>;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-4 md:col-span-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="font-mono text-lg text-navy">{data.reportRef}</h1>
            <select
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
              value={data.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {data.category.replaceAll("_", " ")} · {data.severity} · {data.department ?? "No department"} ·{" "}
            {data.location ?? "No location"}
          </p>
          <p className="mt-4 whitespace-pre-wrap text-sm text-gray-700">{data.description}</p>

          {data.files.length > 0 && (
            <div className="mt-4">
              <p className="text-xs uppercase text-gray-400">Evidence</p>
              <ul className="mt-1 text-sm text-accent">
                {data.files.map((f) => (
                  <li key={f.id}>{f.originalName}</li>
                ))}
              </ul>
            </div>
          )}

          {!data.isAnonymous && data.reporterEmail && (
            <p className="mt-4 text-xs text-gray-400">Reporter contact: {data.reporterEmail}</p>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-600">Internal Notes</h2>
          <div className="mt-3 space-y-3">
            {data.notes.map((n) => (
              <div key={n.id} className="rounded-lg bg-bg p-3 text-sm">
                <p className="text-gray-700">{n.body}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {n.author.name} · {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="Add an internal note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button onClick={handleAddNote} className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-600">Timeline</h2>
        <ol className="mt-3 space-y-3 border-l border-gray-200 pl-4">
          {data.statusLog.map((event, idx) => (
            <li key={idx} className="relative text-sm">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="font-medium text-navy">{STATUS_LABELS[event.status] ?? event.status}</span>
              <br />
              <span className="text-xs text-gray-400">{new Date(event.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
