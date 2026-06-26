import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { fail } from "../utils/responseHandler";

export interface AuthedRequest extends Request {
  user?: { userId: string; role: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return fail(res, "Unauthorized", 401);
  }
  try {
    const payload = verifyToken(header.slice("Bearer ".length));
    req.user = payload;
    next();
  } catch {
    return fail(res, "Invalid or expired session", 401);
  }
}
