import { Response } from "express";
import { prisma } from "../config/db";
import { AuthedRequest } from "../middlewares/authMiddleware";
import { fail, ok } from "../utils/responseHandler";
import { addNoteSchema, updateReportSchema } from "../validations/reportValidation";
import * as reportService from "../services/reportService";

async function audit(userId: string, action: string, reportId?: string, ip?: string) {
  await prisma.auditLog.create({ data: { userId, action, reportId, ip } });
}

export async function listReports(req: AuthedRequest, res: Response) {
  const { category, severity, status, department } = req.query as Record<string, string>;
  const reports = await reportService.listReports({ category, severity, status, department });
  return ok(res, reports);
}

export async function getReport(req: AuthedRequest, res: Response) {
  const report = await reportService.getReportDetail(req.params.id);
  if (!report) return fail(res, "Report not found", 404);
  await audit(req.user!.userId, "VIEW_CASE", report.id, req.ip);
  return ok(res, report);
}

export async function updateReport(req: AuthedRequest, res: Response) {
  const parsed = updateReportSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues.map((i) => i.message).join(", "));

  const updated = await reportService.updateReport(req.params.id, parsed.data);
  await audit(req.user!.userId, "UPDATE_CASE", req.params.id, req.ip);
  return ok(res, updated);
}

export async function addNote(req: AuthedRequest, res: Response) {
  const parsed = addNoteSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues.map((i) => i.message).join(", "));

  const note = await reportService.addCaseNote(req.params.id, req.user!.userId, parsed.data.body);
  await audit(req.user!.userId, "ADD_NOTE", req.params.id, req.ip);
  return ok(res, note, 201);
}

export async function dashboardStats(_req: AuthedRequest, res: Response) {
  const stats = await reportService.getDashboardStats();
  return ok(res, stats);
}

export async function auditLogs(_req: AuthedRequest, res: Response) {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true } } },
  });
  return ok(res, logs);
}

export async function listOfficers(_req: AuthedRequest, res: Response) {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });
  return ok(res, users);
}
