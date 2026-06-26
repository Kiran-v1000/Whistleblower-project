import { z } from "zod";

export const categoryEnum = z.enum([
  "FINANCIAL_MISCONDUCT",
  "HARASSMENT",
  "DATA_PRIVACY",
  "SAFETY",
  "POLICY_VIOLATION",
  "FRAUD",
  "CONFLICT_OF_INTEREST",
  "OTHER",
]);

export const severityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const submitReportSchema = z.object({
  category: categoryEnum,
  severity: severityEnum,
  department: z.string().max(100).optional(),
  incidentDate: z.coerce.date(),
  location: z.string().max(150).optional(),
  description: z.string().min(20).max(8000),
  isAnonymous: z.coerce.boolean().default(true),
  reporterEmail: z.string().email().optional(),
});

export const updateReportSchema = z.object({
  status: z.enum(["SUBMITTED", "ACKNOWLEDGED", "UNDER_REVIEW", "RESOLVED", "CLOSED"]).optional(),
  assignedToId: z.string().uuid().nullable().optional(),
  outcome: z.enum(["SUBSTANTIATED", "UNSUBSTANTIATED", "INCONCLUSIVE"]).nullable().optional(),
  note: z.string().max(2000).optional(),
});

export const addNoteSchema = z.object({
  body: z.string().min(1).max(2000),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
