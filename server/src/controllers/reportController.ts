import { Request, Response } from "express";
import { fail, ok } from "../utils/responseHandler";
import { submitReportSchema } from "../validations/reportValidation";
import * as reportService from "../services/reportService";

export async function createReport(req: Request, res: Response) {
  const parsed = submitReportSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, parsed.error.issues.map((i) => i.message).join(", "));
  }

  const result = await reportService.submitReport(parsed.data);

  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  for (const file of files) {
    await reportService.addReportFile(result.id, {
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    });
  }

  return ok(res, { reportRef: result.reportRef }, 201);
}

export async function trackReport(req: Request, res: Response) {
  const { ref } = req.params;
  const status = await reportService.getReportStatus(ref);
  if (!status) return fail(res, "Report not found", 404);
  return ok(res, status);
}
