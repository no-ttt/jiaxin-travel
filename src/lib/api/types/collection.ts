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

/** Provisional read model — see note in trip.ts about untyped backend responses. */
export type Collection = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  tag_text?: string;
  theme_color?: string;
  button_color?: string;
  hero_media_id?: string | null;
  trip_ids: string[];
};
