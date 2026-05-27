import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import type { AppEnv } from "./types";

type SuccessOptions = {
  message?: string;
  status?: StatusCode;
};

const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred";

export const sendSuccess = <T>(
  c: Context<AppEnv>,
  data: T,
  options: SuccessOptions = {},
) => {
  const { message = "Success", status = 200 } = options;
  return c.json({ success: true, message, data }, status);
};

export const sendError = (
  c: Context<AppEnv>,
  error: unknown,
  status: StatusCode = 500,
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
) => {
  const message = error instanceof Error ? error.message : fallbackMessage;
  return c.json({ success: false, message }, status);
};

export const sendValidationError = (
  c: Context<AppEnv>,
  message: string,
) => c.json({ success: false, message }, 400);
