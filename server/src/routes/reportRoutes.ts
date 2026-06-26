import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createReport, trackReport } from "../controllers/reportController";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Submission limit reached. Try again later." },
});

router.post("/", submitLimiter, upload.array("evidence", 5), createReport);
router.get("/:ref/status", trackReport);

export default router;
