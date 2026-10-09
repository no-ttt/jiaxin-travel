export type InquiryKind = "trip" | "custom_group" | "meian";
export type InquiryStatus = "new" | "in_progress" | "closed";

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

export type CompanionNeed = "嬰幼兒" | "銀髮長輩" | "行動不便者" | "寵物同行";

/** Trip requirements nested in CustomGroupIn (CustomGroupDetail in the OpenAPI spec). */
export type CustomGroupDetail = {
  /** max 100 */
  destination: string;
  /** max 50 */
  travel_style?: string;
  /** max 20 */
  days?: string;
  /** max 50 */
  departure?: string;
  adults?: number | null;
  children?: number | null;
  companion_needs?: CompanionNeed[];
  /** max 30 */
  budget?: string;
  flight_included?: boolean | null;
  /** max 300 */
  notes?: string;
};

/** POST /public/inquiries/custom-group and /public/inquiries/meian (CustomGroupIn). */
export type CustomGroupIn = Omit<TripInquiryIn, "trip_code"> & {
  detail: CustomGroupDetail;
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
