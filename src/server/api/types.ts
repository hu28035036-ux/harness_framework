export type ApiRole = "guest" | "customer" | "worker" | "admin";

export type ApiSession = {
  userId: string;
  roles: readonly ApiRole[];
};

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: { code: string; message: string } };

export type ApiContext = {
  session: ApiSession | null;
};
