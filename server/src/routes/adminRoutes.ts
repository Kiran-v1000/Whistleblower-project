import { Router } from "express";
import {
  addNote,
  auditLogs,
  dashboardStats,
  getReport,
  listOfficers,
  listReports,
  updateReport,
} from "../controllers/adminController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/dashboard", dashboardStats);
router.get("/reports", listReports);
router.get("/reports/:id", getReport);
router.patch("/reports/:id", updateReport);
router.post("/reports/:id/notes", addNote);
router.get("/audit-logs", auditLogs);
router.get("/officers", listOfficers);

export default router;
