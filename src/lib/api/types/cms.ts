import type { Media } from "./media";

export type CmsLastUpdated = {
  at: string;
  by: string;
  staff_code: string | null;
};

/** GET /admin/cms/{key}. PUT takes the `data` object itself as the body and returns `{ ok: true }`. */
export type CmsDocument<T = Record<string, unknown>> = {
  key: string;
  data: T;
  last_updated: CmsLastUpdated | null;
};

/**
 * Admin homepage document (`GET /admin/cms/homepage` → `data`), confirmed against
 * the live API. Media fields hold media ids; the public endpoint resolves them to URLs.
 */
export type HomepageDocBanner = {
  title: string;
  subtitle: string;
  media_id: string | null;
};

export type HomepageDocVideo = {
  title: string;
  source_type: "url" | "upload";
  video_url: string | null;
  video_media_id: string | null;
  thumb_media_id: string | null;
};

export const HOMEPAGE_FEATURED_KEYS = ["guaranteed", "premium", "theme"] as const;
export type HomepageFeaturedKey = (typeof HOMEPAGE_FEATURED_KEYS)[number];

export type HomepageDocFeatured = {
  title: string;
  eyebrow_en: string;
  visible: boolean;
  trip_ids: string[];
  /** Not edited in the admin UI; round-tripped unchanged. */
  items: unknown[];
};

export type HomepageDocBrandFeature = {
  title: string;
  description: string;
  icon_media_id: string | null;
};

export type HomepageDocTestimonial = {
  name: string;
  trip_info: string;
  rating: number;
  content: string;
  /** No field in the admin UI yet; round-tripped unchanged. */
  photo_media_id: string | null;
};

export type HomepageDoc = {
  banners: HomepageDocBanner[];
  videos: HomepageDocVideo[];
  quick_keywords: string[];
  featured: Record<HomepageFeaturedKey, HomepageDocFeatured>;
  brand_features: HomepageDocBrandFeature[];
  testimonials: HomepageDocTestimonial[];
};

/**
 * Public read models below are confirmed against the live API response
 * (GET /api/v1/public/homepage, /public/navigation, /public/footer), not
 * guessed from OpenAPI (which declares these as untyped `{}`).
 */

/** Media fields in public read models are full media objects (same shape as GET /admin/media/{id}). */
export type PublicMedia = Media;

export type HomepageBanner = {
  title: string;
  subtitle: string;
  image: PublicMedia | null;
};

export type HomepageVideo = {
  title: string;
  source_type: "url" | "upload";
  video_url: string | null;
  video: PublicMedia | null;
  thumb: PublicMedia | null;
};

/** Trip card in /public/homepage featured_sections[].trips (confirmed against the live API). */
export type HomepageTripCard = {
  trip_code: string;
  trip_type: "own" | "external";
  product_name: string;
  description: string;
  cover: PublicMedia | null;
  price_from: number | null;
  currency: string;
  duration_days: number | null;
  badge: string | null;
  status: string | null;
  image_summary: string | null;
  external_url: string | null;
};

/** Hidden sections (`visible: false` in the admin doc) are already omitted by the backend. */
export type HomepageFeaturedSection = {
  key: string;
  eyebrow_en: string;
  title: string;
  trips: HomepageTripCard[];
};

export type HomepageBrandFeature = {
  icon: PublicMedia | null;
  title: string;
  description: string;
};

export type HomepageTestimonial = {
  name: string;
  trip_info: string;
  rating: number;
  content: string;
  photo: PublicMedia | null;
};

export type Homepage = {
  banners: HomepageBanner[];
  videos: HomepageVideo[];
  quick_keywords: string[];
  featured_sections: HomepageFeaturedSection[];
  brand_features: HomepageBrandFeature[];
  testimonials: HomepageTestimonial[];
};

export type NavCategoryPublic = {
  key: string;
  display_name: string;
  submenu_enabled: boolean;
  redirect_url: string | null;
};

export type NavRegion = {
  id: number;
  name: string;
};

export type NavTheme = {
  id: number;
  name: string;
  collection_id: number;
};

export type Navigation = {
  categories: NavCategoryPublic[];
  regions: NavRegion[];
  themes: NavTheme[];
};

export type FooterLink = {
  url: string;
  label: string;
};

export type Footer = {
  email: string;
  phone: string;
  address: string;
  links: FooterLink[];
  line_url: string | null;
  copyright: string;
  legal_info: string;
  facebook_url: string | null;
  instagram_url: string | null;
  brand_name_en: string;
  brand_name_zh: string;
  logo: string | null;
};

/**
 * 護照及簽證代辦（GET /public/visa-services; admin doc `GET /admin/cms/visa-services` → `data`).
 * Confirmed against the live public response; the admin doc is assumed to share this shape.
 */
export type VisaDownload = {
  label: string;
  url: string;
  media_id: string | null;
};

export type VisaRequiredDoc = {
  title: string;
  body_html: string;
  downloads: VisaDownload[];
};

/**
 * 辦證須知 / 文件下載 rows as the design needs them. `notice_title`, `notice_docs` and the
 * download `title` / `description` are requested from the backend and not stored yet (it drops
 * unknown fields), hence optional; until then 辦證須知 falls back to `notice_html`.
 */
export type VisaNoticeDoc = {
  title: string;
  body_html: string;
};

export type VisaDownloadDoc = VisaDownload & {
  title?: string;
  description?: string;
};

/** 「查看詳情」drawer: 需備資料 / 辦證須知 / 文件下載 tabs. */
export type VisaServiceDetail = {
  required_docs_visible: boolean;
  required_docs_title: string;
  required_docs: VisaRequiredDoc[];
  notice_visible: boolean;
  notice_title?: string;
  notice_docs?: VisaNoticeDoc[];
  /** Legacy single-block 辦證須知; read-only fallback, round-tripped unchanged. */
  notice_html: string;
  downloads_visible: boolean;
  downloads: VisaDownloadDoc[];
};

export type VisaPassportItem = {
  name: string;
  visible: boolean;
  validity: string;
  working_days: string;
  fee: string;
  detail: VisaServiceDetail;
};

export type VisaCountryItem = {
  name: string;
  visible: boolean;
  validity: string;
  days_text: string;
  fee_text: string;
  detail: VisaServiceDetail;
};

export type VisaServices = {
  /** Not shown on the site; round-tripped unchanged. */
  visa_badge_text: string;
  passport_items: VisaPassportItem[];
  visa_items: VisaCountryItem[];
};
