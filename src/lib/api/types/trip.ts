import type { CmsLastUpdated } from "./cms";
import type { Media } from "./media";

export type TripType = "own" | "external";
export type PublishStatus = "draft" | "published" | "unpublished";
export type TripZone = "overseas_group" | "theme_travel" | "premium" | "meian";

export type TripCreate = {
  trip_code: string;
  trip_type?: TripType;
  product_name?: string;
};

export type TripCreateResponse = {
  id: string;
  trip_code: string;
};

/** PATCH /admin/trips/{id}. `trip_type` and `trip_code` cannot be changed after creation. */
export type TripUpdate = Partial<{
  cover_media_id: string | null;
  product_name: string | null;
  product_description: string | null;
  service_tags: string[] | null;
  service_tags_visible: boolean | null;
  cover_headline: string | null;
  duration_days: number | null;
  duration_nights: number | null;
  seo_title: string | null;
  price_from: number | null;
  currency: string | null;
  departure_months: number[] | null;
  default_origin: string | null;
  deposit_per_person: number | null;
  image_summary_visible: boolean | null;
  base_departure_date: string | null;
  base_return_date: string | null;
  external_url: string | null;
  source_agency: string | null;
  flight_note: string | null;
  status_id: number | null;
  badge_mode: BadgeMode | null;
  badge_id: number | null;
  publish_status: PublishStatus | null;
  region_ids: number[] | null;
  theme_ids: number[] | null;
  in_overseas_group: boolean | null;
  in_theme_travel: boolean | null;
  in_premium: boolean | null;
  in_meian: boolean | null;
}>;

export type BadgeMode = "auto" | "none" | "custom";

export type FlightIn = {
  flight_date?: string | null;
  airline_flight?: string;
  depart_time?: string | null;
  depart_city?: string;
  arrive_time?: string | null;
  arrive_city?: string;
  day_offset?: number;
  leg_label?: string | null;
};

export type FlightsPayload = {
  note: string;
  rows: FlightIn[];
};

export type DayImageIn = {
  media_id: string;
  caption?: string;
};

export type DayIn = {
  day_number: number;
  points?: string[];
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  lodging?: string;
  description?: string;
  images?: DayImageIn[];
};

export type NoticeTabIn = {
  title?: string;
  body_html?: string;
  visible?: boolean;
};

export type FeatureCardImageIn = {
  media_id: string;
  caption?: string;
};

export type FeatureCardIn = {
  title?: string;
  body_html?: string;
  images?: FeatureCardImageIn[];
};

export type BatchAction = {
  trip_ids: string[];
  action: string;
};

/** GET /admin/trips → items[]. Confirmed against the live API. */
export type TripListItem = {
  id: string;
  trip_code: string;
  product_name: string;
  trip_type: TripType;
  duration: string | null;
  price_from: number | null;
  publish_status: PublishStatus;
  updated_at: string;
};

/** Provisional: public search / collection trip rows are not yet verified against the API. */
export type Trip = TripListItem;

/** Read models nested in GET /admin/trips/{id} (confirmed against the live API). */
export type TripImage = { media: Media; caption: string };

export type TripFeatureCard = {
  id: string;
  title: string;
  body_html: string;
  images: TripImage[];
};

/** Times come back as "HH:MM:SS". */
export type TripFlightRow = {
  flight_date: string | null;
  airline_flight: string;
  depart_time: string | null;
  depart_city: string;
  arrive_time: string | null;
  arrive_city: string;
  day_offset: number;
  leg_label: string | null;
};

/** `date` is derived by the backend from base_departure_date. */
export type TripDay = {
  day_number: number;
  date: string | null;
  points: string[];
  breakfast: string;
  lunch: string;
  dinner: string;
  lodging: string;
  description: string;
  images: TripImage[];
};

export type TripNoticeTab = { title: string; body_html: string; visible: boolean };

/** GET /admin/trips/{id}. Confirmed against the live API. */
export type TripDetail = {
  id: string;
  trip_code: string;
  trip_type: TripType;
  publish_status: PublishStatus;
  cover: {
    cover_media: Media | null;
    product_name: string;
    product_description: string;
    service_tags: string[];
    service_tags_visible: boolean;
    cover_headline: string;
    duration_days: number | null;
    duration_nights: number | null;
  };
  basic: {
    seo_title: string;
    price_from: number | null;
    currency: string;
    departure_months: number[];
    default_origin: string;
    deposit_per_person: number | null;
    image_summary_visible: boolean;
    image_summary: string | null;
    base_departure_date: string | null;
    base_return_date: string | null;
    external_url: string | null;
    source_agency: string | null;
    status_id: number | null;
    badge_mode: BadgeMode;
    badge_id: number | null;
    region_ids: number[];
    theme_ids: number[];
    zones: Record<TripZone, boolean>;
  };
  feature_cards: TripFeatureCard[];
  flights: { note: string; rows: TripFlightRow[] };
  days: TripDay[];
  notice_tabs: TripNoticeTab[];
  last_updated: CmsLastUpdated | null;
};

export type TripListFilters = Partial<{
  keyword: string;
  region_ids: number[];
  theme_ids: number[];
  zone: TripZone;
  trip_type: TripType;
  publish_status: PublishStatus;
  duration_band: string;
  sort: string;
  page: number;
  limit: number;
}>;

/* ---------- Public (front-site) read models, confirmed against the live API ---------- */

/** Card row in GET /public/trips/search (same shape as homepage featured trips). */
export type PublicTripCard = {
  trip_code: string;
  trip_type: TripType;
  product_name: string;
  description: string;
  cover: Media | null;
  price_from: number | null;
  currency: string;
  duration_days: number | null;
  badge: string | null;
  status: string | null;
  image_summary: string | null;
  external_url: string | null;
};

export type PublicTripSearchParams = Partial<{
  keyword: string;
  region_ids: number[];
  theme_ids: number[];
  zone: TripZone;
  /** "1-5" | "6-10" | "11-15" | "15+" */
  duration_bands: string[];
  /** "lt20k" | "20-40k" | "40-70k" | "70-120k" | "120k+"; any other value is a 422. */
  budget_bands: string[];
  departure_months: number[];
  date_from: string;
  date_to: string;
  /** "popular" | "price_asc" | "price_desc" | "departure_date" */
  sort: string;
  page: number;
  limit: number;
}>;

export type PublicTripImage = { media: Media; caption: string };

/**
 * GET /public/trips/{trip_code}. Only visible notice tabs are returned. External trips omit
 * flight_note / flights / feature_cards / days / notice_tabs entirely (confirmed against the live API).
 */
export type PublicTripDetail = PublicTripCard & {
  seo: { title: string; description: string; og_image: string | null };
  service_tags: string[];
  cover_headline: string;
  departure_date: string | null;
  deposit_per_person: number | null;
  /** "inquiry" for own trips; external trips link out via external_url. */
  cta: string;
  publish_status: PublishStatus;
  flight_note?: string;
  flights?: {
    flight_date: string | null;
    airline_flight: string;
    depart_time: string | null;
    depart_city: string;
    arrive_time: string | null;
    arrive_city: string;
    day_offset: number;
    leg_label: string | null;
  }[];
  feature_cards?: { title: string; body_html: string; images: PublicTripImage[] }[];
  days?: {
    day_number: number;
    date: string | null;
    points: string[];
    meals: { breakfast: string; lunch: string; dinner: string };
    lodging: string;
    description: string;
    images: PublicTripImage[];
  }[];
  notice_tabs?: { title: string; body_html: string }[];
};
