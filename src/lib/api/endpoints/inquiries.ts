import { apiFetch } from "../client";
import type { Paginated } from "../types/common";
import type {
  CustomGroupDetail,
  CustomGroupIn,
  Inquiry,
  InquiryListFilters,
  InquiryPatch,
  InquiryStats,
  NameIn,
  TripInquiryIn,
} from "../types/inquiry";

function buildQuery(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const inquiriesApi = {
  // admin:inquiries
  list: (filters: InquiryListFilters = {}) =>
    apiFetch<Paginated<Inquiry>>(`/admin/inquiries${buildQuery(filters)}`),

  stats: () => apiFetch<InquiryStats>("/admin/inquiries/stats"),

  exportCsv: () => apiFetch<string>("/admin/inquiries/export.csv"),

  get: (inquiryId: string) => apiFetch<Inquiry>(`/admin/inquiries/${inquiryId}`),

  patch: (inquiryId: string, payload: InquiryPatch) =>
    apiFetch<Inquiry>(`/admin/inquiries/${inquiryId}`, { method: "PATCH", body: payload }),

  // public:inquiries
  submitTrip: (payload: TripInquiryIn) =>
    apiFetch<void>("/public/inquiries/trip", { method: "POST", body: payload, auth: false }),

  submitCustomGroup: (payload: CustomGroupIn) =>
    apiFetch<CustomGroupDetail>("/public/inquiries/custom-group", {
      method: "POST",
      body: payload,
      auth: false,
    }),

  submitMeian: (payload: NameIn) =>
    apiFetch<void>("/public/inquiries/meian", { method: "POST", body: payload, auth: false }),
};
