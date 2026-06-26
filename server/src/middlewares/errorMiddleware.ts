import { NextFunction, Request, Response } from "express";
import { fail } from "../utils/responseHandler";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  const message = err instanceof Error ? err.message : "Internal server error";
  return fail(res, message, 500);
}
