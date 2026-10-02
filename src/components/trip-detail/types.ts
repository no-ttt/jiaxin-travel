export type FlightLeg = {
  direction: "去程" | "回程";
  date: string;
  airline: string;
  flightNumber: string;
  departTime: string;
  departCity: string;
  arriveTime: string;
  arriveCity: string;
  nextDay?: boolean;
};

export type FeatureBlock = {
  id: string;
  title: string;
  paragraphs: string[];
  /** Rich-text body from the admin editor; rendered instead of `paragraphs` when present. */
  bodyHtml?: string;
  images: string[];
  caption: string;
  /** Per-image captions (same order as `images`); shown with the active slide when present. */
  captions?: string[];
};

export type SpecItem = {
  id: string;
  title: string;
  description: string;
};

export type StopType = "visit" | "photo" | "pass";

export type Stop = {
  name: string;
  type: StopType;
};

export type DayPlan = {
  date: string;
  day: number;
  weekday: string;
  stops: Stop[];
  meals: { breakfast: string; lunch: string; dinner: string };
  hotelOptions: string[];
  description: string;
  image: string;
};

export type NoticeTab = {
  id: string;
  label: string;
};

export type TripDetail = {
  id: string;
  title: string;
  groupCode: string;
  heroImage: string;
  durationDays: number;
  departureCity: string;
  tags: string[];
  startDate: string;
  deposit: string;
  guaranteedDeparture: boolean;
  highlights: string[];
  price: string;
  flights: FlightLeg[];
  featureBlocks: FeatureBlock[];
  moreFeatures: string[];
  specs: SpecItem[];
  specGalleryImages: string[];
  days: DayPlan[];
  tipNotice: string;
  reminders: string[];
  ageReminderItems: string[];
  /** Notice tabs from the API (visible ones only); replaces the built-in placeholder tabs when present. */
  noticeTabs?: { title: string; bodyHtml: string }[];
  /** External-link trips send the CTA to the partner site instead of the inquiry form. */
  externalUrl?: string | null;
  /** 封面主標題 shown as the page heading; falls back to `title` (product name). */
  coverHeadline?: string;
  /** 後台「航程備註」; replaces the default disclaimer under 航程資訊 when present. */
  flightNote?: string;
  /** SEO / browser-tab title (後台「標題」). */
  seoTitle?: string;
  /** e.g. "TWD"; the mock data has none. */
  currency?: string;
};
