import { NextResponse } from "next/server";
import type { ApiResult } from "./types";

export function ok<T>(data: T, status = 200): ApiResult<T> {
  return { ok: true, status, data };
}

export function fail(code: string, message: string, status = 400): ApiResult<never> {
  return { ok: false, status, error: { code, message } };
}

export function requireFields(input: Record<string, unknown>, fields: readonly string[]) {
  const missing = fields.filter((field) => input[field] === undefined || input[field] === null || input[field] === "");
  if (missing.length > 0) {
    return fail("VALIDATION_FAILED", `Missing required fields: ${missing.join(", ")}`, 422);
  }
  return null;
}

export function toNextResponse<T>(result: ApiResult<T>) {
  if (result.ok) {
    return NextResponse.json({ ok: true, data: result.data }, { status: result.status });
  }
  return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
}

export async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}
