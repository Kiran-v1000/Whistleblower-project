import { apiClient } from "./client";

export async function login(email: string, password: string) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data.data as { token: string; user: { id: string; name: string; email: string; role: string } };
}

export async function getDashboardStats() {
  const { data } = await apiClient.get("/admin/dashboard");
  return data.data;
}

export async function listReports(filters: Record<string, string>) {
  const { data } = await apiClient.get("/admin/reports", { params: filters });
  return data.data;
}

export async function getReportDetail(id: string) {
  const { data } = await apiClient.get(`/admin/reports/${id}`);
  return data.data;
}

export async function updateReport(id: string, changes: Record<string, unknown>) {
  const { data } = await apiClient.patch(`/admin/reports/${id}`, changes);
  return data.data;
}

export async function addNote(id: string, body: string) {
  const { data } = await apiClient.post(`/admin/reports/${id}/notes`, { body });
  return data.data;
}

export async function getAuditLogs() {
  const { data } = await apiClient.get("/admin/audit-logs");
  return data.data;
}

export async function getOfficers() {
  const { data } = await apiClient.get("/admin/officers");
  return data.data;
}
