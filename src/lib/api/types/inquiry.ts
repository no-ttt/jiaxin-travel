export type InquiryKind = "trip" | "custom_group" | "meian";
export type InquiryStatus = "new" | "in_progress" | "closed";

export type NameIn = {
  name: string;
};

/** POST /public/inquiries/trip (TripInquiryIn in the OpenAPI spec). */
export type TripInquiryIn = {
  trip_code: string;
  /** max 50 */
  name: string;
  email: string;
  /** max 30 */
  phone?: string;
  /** max 50 */
  line_id?: string;
  /** max 100 */
  company?: string;
  /** max 30 */
  preferred_contact_time?: string;
  /** max 300 */
  message?: string;
  consent: boolean;
  turnstile_token?: string | null;
  /** Honeypot: must stay empty (real users never see this field). */
  website?: string;
};

export type CustomGroupIn = {
  name: string;
  phone: string;
  email?: string;
  destination?: string;
  message?: string;
};

export type CustomGroupDetail = CustomGroupIn & {
  id: string;
};

export type InquiryPatch = Partial<{
  status: InquiryStatus | null;
  internal_note: string | null;
}>;

export type InquiryListFilters = Partial<{
  kind: InquiryKind;
  status: InquiryStatus;
  q: string;
  date_from: string;
  date_to: string;
  trip_code: string;
  sort: "created_desc" | "created_asc";
  page: number;
  limit: number;
}>;

/** Provisional read model — see note in trip.ts about untyped backend responses. */
export type Inquiry = {
  id: string;
  kind: InquiryKind;
  status: InquiryStatus;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  trip_code?: string;
  internal_note?: string;
  created_at: string;
};

export type InquiryStats = {
  total: number;
  by_status: Record<InquiryStatus, number>;
  by_kind: Record<InquiryKind, number>;
};
