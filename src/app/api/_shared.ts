import { headerSessionProvider } from "@/server/auth/session";
import { readJson, toNextResponse } from "@/server/api/result";

export function contextFrom(request: Request) {
  return { session: headerSessionProvider.fromRequest(request) };
}

export async function jsonFrom(request: Request) {
  return readJson(request);
}

export { toNextResponse };
