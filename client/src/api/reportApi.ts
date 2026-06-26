import { apiClient } from "./client";

export interface SubmitReportPayload {
  category: string;
  severity: string;
  department?: string;
  incidentDate: string;
  location?: string;
  description: string;
  isAnonymous: boolean;
  reporterEmail?: string;
  files: File[];
}

export async function submitReport(payload: SubmitReportPayload) {
  const formData = new FormData();
  formData.append("category", payload.category);
  formData.append("severity", payload.severity);
  if (payload.department) formData.append("department", payload.department);
  formData.append("incidentDate", payload.incidentDate);
  if (payload.location) formData.append("location", payload.location);
  formData.append("description", payload.description);
  formData.append("isAnonymous", String(payload.isAnonymous));
  if (payload.reporterEmail) formData.append("reporterEmail", payload.reporterEmail);
  payload.files.forEach((file) => formData.append("evidence", file));

  const { data } = await apiClient.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data as { reportRef: string };
}

export async function trackReport(ref: string) {
  const { data } = await apiClient.get(`/reports/${ref}/status`);
  return data.data;
}
