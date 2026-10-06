import type { JourneyWithAlbum } from "@/lib/api/hooks/useJourneys";
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
  };
}

export function createJourneyMedia(mediaId: string): JourneyMedia {
  return { key: generateId("media"), mediaId, caption: "" };
}

export function toJourneyCards(rows: JourneyWithAlbum[]): JourneyCard[] {
  return rows.map(({ journey, album }) => ({
    key: journey.id,
    id: journey.id,
    name: journey.name,
    visible: journey.visible,
    coverMediaId: journey.cover?.id ?? journey.cover_media_id ?? null,
    review: journey.quote ?? "",
    rating: journey.rating_text ?? "",
    albumTitle: journey.album_title ?? album.album_title ?? "",
    media: (album.items ?? []).flatMap((item, i) => {
      const mediaId = item.media?.id ?? item.media_id;
      return mediaId
        ? [{ key: item.id ?? `${journey.id}-media-${i}`, mediaId, caption: item.caption ?? "" }]
        : [];
    }),
  }));
}

export const isNameValid = (name: string) => {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= JOURNEY_NAME_MAX;
};

export const isDraftValid = (cards: JourneyCard[]) => cards.every((card) => isNameValid(card.name));
