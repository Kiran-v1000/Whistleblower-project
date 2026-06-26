import crypto from "crypto";
import path from "path";
import multer from "multer";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (_req, file, callback) => {
    const storedName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    callback(null, storedName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return callback(new Error("Unsupported file type"));
    }
    callback(null, true);
  },
});
