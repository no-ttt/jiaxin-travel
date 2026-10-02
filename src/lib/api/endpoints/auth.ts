import { apiFetch } from "../client";
import type { AdminUser, LoginIn, LoginOut } from "../types/auth";

export const authApi = {
  login: (payload: LoginIn) =>
    apiFetch<LoginOut>("/admin/auth/login", { method: "POST", body: payload, auth: false }),

  refresh: () => apiFetch<LoginOut>("/admin/auth/refresh", { method: "POST", auth: false }),

  logout: () => apiFetch<void>("/admin/auth/logout", { method: "POST" }),

  me: () => apiFetch<AdminUser>("/admin/auth/me"),
};
