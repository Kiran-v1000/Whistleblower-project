import { Request, Response } from "express";
import { fail, ok } from "../utils/responseHandler";
import { loginSchema } from "../validations/reportValidation";
import * as authService from "../services/authService";

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Invalid email or password format");

  const result = await authService.login(parsed.data.email, parsed.data.password);
  if (!result) return fail(res, "Invalid credentials", 401);

  return ok(res, result);
}
