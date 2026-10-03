import type { Media } from "./media";
import type { PublicTripCard } from "./trip";

/** PATCH /admin/collections/{id}. Colors must match ^#[0-9A-Fa-f]{6}$. */
export type CollectionUpdate = Partial<{
  title: string | null;
  subtitle: string | null;
  tag_text: string | null;
  theme_color: string | null;
  button_color: string | null;
  hero_media_id: string | null;
}>;

export type AddTripIn = {
  trip_id: string;
};

export type ReorderIn = {
  trip_ids: string[];
};

/** A trip as shown in the admin collection editor (added list and search results). */
export type CollectionTrip = {
  id: string;
  trip_code: string;
  product_name: string;
  price_from: number | null;
  currency: string;
  thumbnail: string | null;
};

/**
 * Admin read model, normalized by `toCollection` in endpoints/collections.ts. GET
 * /admin/collections/{id} (confirmed) returns id, kind, title, subtitle, tag_text, theme_color,
 * button_color, hero (Media | null), items and last_updated.
 */
export type Collection = {
  id: number;
  slug: string;
  kind: string;
  title: string;
  subtitle: string;
  tag_text: string;
  theme_color: string | null;
  button_color: string | null;
  hero_media_id: string | null;
  hero: Media | null;
  trips: CollectionTrip[];
};

/** GET /public/collections/{slug} (confirmed). */
export type PublicCollection = {
  slug: string;
  kind: string;
  title: string;
  subtitle: string;
  tag_text: string;
  theme_color: string | null;
  button_color: string | null;
  hero: Media | null;
  total: number;
  page: number;
  items: PublicTripCard[];
};

export type PublicCollectionParams = Partial<{
  page: number;
  limit: number;
}>;
