import type { Album, Journey } from "@/lib/api/types/journey";
import { generateId } from "../ui/generateId";

export const JOURNEY_NAME_MAX = 60;

export type JourneyMedia = {
  /** Local key: the same media may appear twice in an album. */
  key: string;
  mediaId: string;
  caption: string;
};

export type JourneyCard = {
  /** Local key for tabs/selection; `id` is the API id (null until the journey is created). */
  key: string;
  id: string | null;
  name: string;
  visible: boolean;
  coverMediaId: string | null;
  review: string;
  rating: string;
  albumTitle: string;
  media: JourneyMedia[];
  /** False until this journey's album is fetched (when its tab is opened); unloaded albums are never saved. */
  albumLoaded: boolean;
};

/** A partial update, or one computed from the card's latest state. */
export type CardPatch = Partial<JourneyCard> | ((card: JourneyCard) => Partial<JourneyCard>);

export function createJourneyCard(): JourneyCard {
  return {
    key: generateId("journey"),
    id: null,
    name: "",
    visible: true,
    coverMediaId: null,
    review: "",
    rating: "★★★★★",
    albumTitle: "",
    media: [],
    albumLoaded: true,
  };
}

export function createJourneyMedia(mediaId: string): JourneyMedia {
  return { key: generateId("media"), mediaId, caption: "" };
}

export function toJourneyCards(journeys: Journey[]): JourneyCard[] {
  return journeys.map((journey) => ({
    key: journey.id,
    id: journey.id,
    name: journey.name,
    visible: journey.visible,
    coverMediaId: journey.cover?.id ?? journey.cover_media_id ?? null,
    review: journey.quote ?? "",
    rating: journey.rating_text ?? "",
    albumTitle: journey.album_title ?? "",
    media: [],
    albumLoaded: false,
  }));
}

/** Fills a card with its freshly fetched album (applied to both the server copy and the draft). */
export function withAlbum(card: JourneyCard, album: Album): JourneyCard {
  return {
    ...card,
    albumTitle: card.albumTitle || (album.album_title ?? ""),
    media: (album.items ?? []).flatMap((item, i) => {
      const mediaId = item.media?.id ?? item.media_id;
      return mediaId ? [{ key: item.id ?? `${card.key}-media-${i}`, mediaId, caption: item.caption ?? "" }] : [];
    }),
    albumLoaded: true,
  };
}

export const isNameValid = (name: string) => {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= JOURNEY_NAME_MAX;
};

export const isDraftValid = (cards: JourneyCard[]) => cards.every((card) => isNameValid(card.name));
