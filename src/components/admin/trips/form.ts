import type { BadgeMode, PublishStatus, TripDetail, TripType, TripUpdate } from "@/lib/api/types/trip";

/** Editable cover + basic fields of a trip (everything PATCH /admin/trips/{id} accepts that the UI edits). */
export type TripForm = {
  tripType: TripType;
  cover_media_id: string | null;
  product_name: string;
  product_description: string;
  service_tags: string[];
  service_tags_visible: boolean;
  cover_headline: string;
  duration_days: number | null;
  seo_title: string;
  price_from: number | null;
  currency: string;
  departure_months: number[];
  default_origin: string;
  deposit_per_person: number | null;
  image_summary_visible: boolean;
  base_departure_date: string | null;
  base_return_date: string | null;
  external_url: string;
  source_agency: string;
  status_id: number | null;
  badge_mode: BadgeMode;
  badge_id: number | null;
  publish_status: PublishStatus;
  region_ids: number[];
  theme_ids: number[];
  in_overseas_group: boolean;
  in_theme_travel: boolean;
  in_premium: boolean;
  in_meian: boolean;
};

export type TripFormPatch = Partial<TripForm>;
export type TripFormChange = (patch: TripFormPatch) => void;

export function toTripForm(detail: TripDetail): TripForm {
  const { cover, basic } = detail;
  return {
    tripType: detail.trip_type,
    cover_media_id: cover.cover_media?.id ?? null,
    product_name: cover.product_name,
    product_description: cover.product_description,
    service_tags: cover.service_tags,
    service_tags_visible: cover.service_tags_visible,
    cover_headline: cover.cover_headline,
    duration_days: cover.duration_days,
    seo_title: basic.seo_title,
    price_from: basic.price_from,
    currency: basic.currency,
    departure_months: basic.departure_months,
    default_origin: basic.default_origin,
    deposit_per_person: basic.deposit_per_person,
    image_summary_visible: basic.image_summary_visible,
    base_departure_date: basic.base_departure_date,
    base_return_date: basic.base_return_date,
    external_url: basic.external_url ?? "",
    source_agency: basic.source_agency ?? "",
    status_id: basic.status_id,
    badge_mode: basic.badge_mode,
    badge_id: basic.badge_id,
    publish_status: detail.publish_status,
    region_ids: basic.region_ids,
    theme_ids: basic.theme_ids,
    in_overseas_group: basic.zones.overseas_group,
    in_theme_travel: basic.zones.theme_travel,
    in_premium: basic.zones.premium,
    in_meian: basic.zones.meian,
  };
}

/** PATCH body for the content fields; `publish_status` is sent separately so a failed publish doesn't block saving. */
export function toTripUpdate(form: TripForm): TripUpdate {
  const { tripType, publish_status, ...fields } = form;
  void tripType;
  void publish_status;
  return {
    ...fields,
    external_url: fields.external_url.trim() || null,
    source_agency: fields.source_agency.trim() || null,
    badge_id: fields.badge_mode === "custom" ? fields.badge_id : null,
  };
}

/** "168,000" → 168000; any non-digit is ignored; empty → null. */
export function parseAmount(text: string): number | null {
  const digits = text.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

/** Thousands separators only — no currency prefix, since the trip's currency is a separate field. */
export function formatAmount(value: number | null): string {
  return value == null ? "" : value.toLocaleString();
}

/**
 * 產品起價 display: always prefixed with "NT$" (the API stores only the integer).
 * Interim choice until a currency-symbol field is agreed with the backend.
 */
export function formatPriceFrom(value: number | null): string {
  return value == null ? "" : `NT$ ${value.toLocaleString()}`;
}

/** The UI has no trip-code field, so codes are generated (e.g. CH260930-7K2Q); they cannot be changed later. */
export function generateTripCode(): string {
  const now = new Date();
  const date = [now.getFullYear() % 100, now.getMonth() + 1, now.getDate()]
    .map((n) => String(n).padStart(2, "0"))
    .join("");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CH${date}-${suffix}`;
}
