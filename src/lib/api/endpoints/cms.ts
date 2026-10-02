import { apiFetch } from "../client";
import type { CmsDocument, Footer, Homepage, Navigation } from "../types/cms";

export const cmsApi = {
  // admin:cms
  getDocument: <T = Record<string, unknown>>(key: string) =>
    apiFetch<CmsDocument<T>>(`/admin/cms/${key}`),

  putDocument: <T = Record<string, unknown>>(key: string, data: T) =>
    apiFetch<{ ok: boolean }>(`/admin/cms/${key}`, { method: "PUT", body: data }),

  // public:content
  navigation: () => apiFetch<Navigation>("/public/navigation", { auth: false }),
  homepage: () => apiFetch<Homepage>("/public/homepage", { auth: false }),
  footer: () => apiFetch<Footer>("/public/footer", { auth: false }),
  visaServices: () => apiFetch<unknown>("/public/visa-services", { auth: false }),
  page: (key: string) => apiFetch<unknown>(`/public/pages/${key}`, { auth: false }),
};
