import { apiFetch } from "../client";

export type FrontendStatus = {
  building: boolean;
  last_built_at?: string | null;
};

export const systemApi = {
  frontendStatus: () => apiFetch<FrontendStatus>("/admin/system/frontend-status"),

  frontendUpdateNow: () =>
    apiFetch<void>("/admin/system/frontend-update", { method: "POST" }),
};
