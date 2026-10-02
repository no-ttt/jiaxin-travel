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
};

export type AlbumAppendIn = {
  items: AlbumItemIn[];
};

/** Provisional read model — see note in trip.ts about untyped backend responses. */
export type Journey = {
  id: string;
  name: string;
  visible: boolean;
  position: number;
  cover_media_id?: string | null;
  quote?: string;
  rating_text?: string;
  album_title?: string;
  updated_at: string;
};

export type AlbumItem = AlbumItemIn & {
  id: string;
};
