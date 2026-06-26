import { prisma } from "../config/db";
import { decrypt, encrypt } from "../utils/encryption";
import { generateReportRef } from "../utils/responseHandler";
import { sendAcknowledgmentEmail, sendStatusUpdateEmail } from "./mailService";

interface SubmitReportInput {
  category: string;
  severity: string;
  department?: string;
  incidentDate: Date;
  location?: string;
  description: string;
  isAnonymous: boolean;
  reporterEmail?: string;
}

export async function submitReport(input: SubmitReportInput) {
  let reportRef = generateReportRef();
  while (await prisma.report.findUnique({ where: { reportRef } })) {
    reportRef = generateReportRef();
  }

  const report = await prisma.report.create({
    data: {
      reportRef,
      category: input.category as never,
      severity: input.severity as never,
      department: input.department,
      incidentDate: input.incidentDate,
      location: input.location,
      descriptionEncrypted: encrypt(input.description),
      isAnonymous: input.isAnonymous,
      reporterEmailEncrypted:
        !input.isAnonymous && input.reporterEmail ? encrypt(input.reporterEmail) : null,
      statusLog: { create: { status: "SUBMITTED" } },
    },
  });

  if (!input.isAnonymous && input.reporterEmail) {
    await sendAcknowledgmentEmail(input.reporterEmail, reportRef);
  }

  return { id: report.id, reportRef: report.reportRef };
}

export async function getReportStatus(reportRef: string) {
  const report = await prisma.report.findUnique({
    where: { reportRef },
    include: { statusLog: { orderBy: { createdAt: "asc" } } },
  });
  if (!report) return null;
  return {
    reportRef: report.reportRef,
    status: report.status,
    category: report.category,
    severity: report.severity,
    submittedAt: report.createdAt,
    timeline: report.statusLog.map((event) => ({
      status: event.status,
      at: event.createdAt,
    })),
  };
}

export async function listReports(filters: {
  category?: string;
  severity?: string;
  status?: string;
  department?: string;
}) {
  const reports = await prisma.report.findMany({
    where: {
      category: filters.category as never,
      severity: filters.severity as never,
      status: filters.status as never,
      department: filters.department,
    },
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { id: true, name: true } } },
  });
  return reports.map((report) => ({
    id: report.id,
    reportRef: report.reportRef,
    category: report.category,
    severity: report.severity,
    status: report.status,
    department: report.department,
    isAnonymous: report.isAnonymous,
    assignedTo: report.assignedTo,
    createdAt: report.createdAt,
  }));
}

export async function getReportDetail(id: string) {
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      files: true,
      notes: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
      statusLog: { orderBy: { createdAt: "asc" } },
      assignedTo: { select: { id: true, name: true } },
    },
  });
  if (!report) return null;
  return {
    ...report,
    description: decrypt(report.descriptionEncrypted),
    descriptionEncrypted: undefined,
    reporterEmail: report.reporterEmailEncrypted ? decrypt(report.reporterEmailEncrypted) : null,
    reporterEmailEncrypted: undefined,
  };
}

export async function updateReport(
  id: string,
  changes: { status?: string; assignedToId?: string | null; outcome?: string | null; note?: string }
) {
  const report = await prisma.report.update({
    where: { id },
    data: {
      status: changes.status as never,
      assignedToId: changes.assignedToId,
      outcome: changes.outcome as never,
    },
  });

  if (changes.status) {
    await prisma.statusEvent.create({
      data: { reportId: id, status: changes.status as never, note: changes.note },
    });
    if (report.reporterEmailEncrypted) {
      await sendStatusUpdateEmail(decrypt(report.reporterEmailEncrypted), report.reportRef, changes.status);
    }
  }

  return report;
}

export async function addCaseNote(reportId: string, authorId: string, body: string) {
  return prisma.caseNote.create({ data: { reportId, authorId, body } });
}

export async function addReportFile(
  reportId: string,
  file: { originalName: string; storedName: string; mimeType: string; sizeBytes: number }
) {
  return prisma.reportFile.create({ data: { reportId, ...file } });
}

export async function getDashboardStats() {
  const [total, open, underReview, resolved, byCategory] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: { in: ["SUBMITTED", "ACKNOWLEDGED"] } } }),
    prisma.report.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.report.count({ where: { status: { in: ["RESOLVED", "CLOSED"] } } }),
    prisma.report.groupBy({ by: ["category"], _count: { category: true } }),
  ]);

  const resolvedReports = await prisma.report.findMany({
    where: { status: { in: ["RESOLVED", "CLOSED"] } },
    select: { createdAt: true, updatedAt: true },
  });
  const avgResolutionDays =
    resolvedReports.length === 0
      ? 0
      : resolvedReports.reduce(
          (sum, r) => sum + (r.updatedAt.getTime() - r.createdAt.getTime()) / 86_400_000,
          0
        ) / resolvedReports.length;

  return {
    total,
    open,
    underReview,
    resolved,
    avgResolutionDays: Math.round(avgResolutionDays * 10) / 10,
    byCategory: byCategory.map((c) => ({ category: c.category, count: c._count.category })),
  };
}
