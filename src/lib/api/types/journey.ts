import type { PublicMedia } from "./cms";

export type JourneyIn = {
  name: string;
  visible?: boolean;
  position?: number;
  cover_media_id?: string | null;
  quote?: string;
  rating_text?: string;
  album_title?: string;
};

export type AlbumItemIn = {
  media_id: string;
  caption?: string;
};

export type AlbumReplaceIn = {
  items: AlbumItemIn[];
  album_title?: string | null;
};

export type AlbumAppendIn = {
  items: AlbumItemIn[];
};

/**
 * Admin read model. Reads resolve media ids to full media objects (confirmed on the public side:
 * `cover`, album `items[].media`); the `*_media_id` fields are kept as fallbacks.
 */
export type Journey = {
  id: string;
  name: string;
  visible: boolean;
  position: number;
  cover?: PublicMedia | null;
  cover_media_id?: string | null;
  quote?: string;
  rating_text?: string;
  album_title?: string;
  updated_at: string;
};

/** Album row as read back: `{ media, caption }` (confirmed on GET /public/journeys/{id}/album). */
export type AlbumItem = {
  id?: string;
  media_id?: string;
  caption?: string;
  media?: PublicMedia | null;
};

export type Album = {
  items: AlbumItem[];
  album_title?: string | null;
  count?: number;
};

/** Card in GET /public/journeys (visible journeys only, in display order). */
export type PublicJourney = {
  id: string;
  name: string;
  quote?: string;
  rating_text?: string;
  album_title?: string;
  cover: PublicMedia | null;
  is_video?: boolean;
};

export type PublicJourneyList = {
  items?: PublicJourney[];
  recent?: PublicJourney[];
  more?: PublicJourney[];
};
