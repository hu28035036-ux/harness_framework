import type { ApiRole, ApiSession } from "@/server/api/types";

export type SessionProvider = {
  fromRequest(request: Request): ApiSession | null;
};

const validRoles = new Set<ApiRole>(["guest", "customer", "worker", "admin"]);

export const headerSessionProvider: SessionProvider = {
  fromRequest(request) {
    const userId = request.headers.get("x-zzallog-user-id");
    if (!userId) {
      return null;
    }
    const roles = request.headers
      .get("x-zzallog-roles")
      ?.split(",")
      .map((role) => role.trim())
      .filter((role): role is ApiRole => validRoles.has(role as ApiRole));

    return {
      userId,
      roles: roles && roles.length > 0 ? roles : ["customer"],
    };
  },
};

export function hasRole(session: ApiSession | null, role: ApiRole) {
  return Boolean(session?.roles.includes(role));
}
