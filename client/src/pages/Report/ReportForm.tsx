import { useState } from "react";
import toast from "react-hot-toast";
import { submitReport } from "../../api/reportApi";
import { CATEGORIES, SEVERITIES } from "../../utils/constants";

interface FormState {
  category: string;
  severity: string;
  department: string;
  incidentDate: string;
  location: string;
  description: string;
  isAnonymous: boolean;
  reporterEmail: string;
  files: File[];
}

const initialState: FormState = {
  category: "",
  severity: "MEDIUM",
  department: "",
  incidentDate: "",
  location: "",
  description: "",
  isAnonymous: true,
  reporterEmail: "",
  files: [],
};

export default function ReportForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [reportRef, setReportRef] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canProceedFromStep1() {
    return form.category && form.severity && form.incidentDate;
  }

  async function handleSubmit() {
    if (!form.description || form.description.length < 20) {
      toast.error("Please describe the concern in at least 20 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitReport({
        category: form.category,
        severity: form.severity,
        department: form.department || undefined,
        incidentDate: form.incidentDate,
        location: form.location || undefined,
        description: form.description,
        isAnonymous: form.isAnonymous,
        reporterEmail: form.isAnonymous ? undefined : form.reporterEmail || undefined,
        files: form.files,
      });
      setReportRef(result.reportRef);
      toast.success("Report submitted successfully");
    } catch {
      toast.error("Something went wrong submitting your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reportRef) {
    return (
      <div className="mx-auto max-w-lg rounded-xl bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-navy">Report Submitted</h2>
        <p className="mt-2 text-sm text-gray-600">
          Keep this reference ID safe — you'll need it to track your report status.
        </p>
        <div
          className="mt-4 cursor-pointer rounded-lg bg-bg px-4 py-3 font-mono text-lg text-navy"
          onClick={() => {
            navigator.clipboard.writeText(reportRef);
            toast.success("Copied to clipboard");
          }}
        >
          {reportRef} <span className="ml-2 text-xs text-accent">(click to copy)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        Step {step} of 3
        <div className="flex flex-1 gap-1">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded ${s <= step ? "bg-accent" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-navy">What happened?</h2>
            <div>
              <label className="text-xs font-medium uppercase text-gray-500">Category</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-gray-500">Severity</label>
              <div className="mt-1 flex gap-2">
                {SEVERITIES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => update("severity", s.value)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                      form.severity === s.value
                        ? "border-navy bg-navy text-white"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium uppercase text-gray-500">Incident Date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={form.incidentDate}
                  onChange={(e) => update("incidentDate", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-gray-500">Department (optional)</label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  placeholder="e.g. Finance, HR"
                  value={form.department}
                  onChange={(e) => update("department", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase text-gray-500">Location / Site (optional)</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                disabled={!canProceedFromStep1()}
                onClick={() => setStep(2)}
                className="rounded-lg bg-navy px-5 py-2.5 font-semibold text-white disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-navy">Describe the concern</h2>
            <textarea
              className="h-40 w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder="Provide as much detail as possible — what happened, who was involved, how often it occurs..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
            <div>
              <label className="text-xs font-medium uppercase text-gray-500">Supporting evidence (optional)</label>
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                onChange={(e) => update("files", Array.from(e.target.files ?? []))}
                className="mt-1 w-full rounded-lg border border-dashed border-gray-300 px-3 py-4 text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">PDF, images, documents — max 20MB each</p>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="rounded-lg px-5 py-2.5 font-semibold text-gray-500">
                Back
              </button>
              <button onClick={() => setStep(3)} className="rounded-lg bg-navy px-5 py-2.5 font-semibold text-white">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-navy">Identity preference</h2>
            <label className="flex items-center gap-3 rounded-lg bg-bg px-4 py-3">
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(e) => update("isAnonymous", e.target.checked)}
              />
              <span className="text-sm">Submit anonymously (no follow-up email possible)</span>
            </label>
            {!form.isAnonymous && (
              <div>
                <label className="text-xs font-medium uppercase text-gray-500">Your Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={form.reporterEmail}
                  onChange={(e) => update("reporterEmail", e.target.value)}
                />
              </div>
            )}
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="rounded-lg px-5 py-2.5 font-semibold text-gray-500">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-white disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
