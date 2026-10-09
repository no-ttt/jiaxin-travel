import type { PublicMedia } from "@/lib/api/types/cms";
import { videoSrc } from "@/lib/api/types/media";
import type { Album, PublicJourney, PublicJourneyList } from "@/lib/api/types/journey";

export type JourneyLayout = "hero" | "tall" | "small" | "wide";

/** An image, or a video with an optional poster (its generated thumbnail). */
export type JourneyVisual = {
  isVideo: boolean;
  /** Image URL, or the video's poster when it has one. */
  imageUrl: string | null;
  videoUrl: string | null;
};

export type JourneyAlbumPhoto = JourneyVisual & {
  key: string;
  caption: string;
};

export type JourneyStory = {
  id: string;
  title: string;
  quote: string;
  rating: string;
  albumTitle: string;
  cover: JourneyVisual | null;
  layout: JourneyLayout;
};

/** Bento rows of two cards, repeating every four rows (the design has no per-card layout setting). */
const LAYOUT_CYCLE: JourneyLayout[] = ["hero", "tall", "small", "wide", "wide", "small", "tall", "hero"];

export function toVisual(media: PublicMedia | null | undefined, variant: "card" | "hero"): JourneyVisual | null {
  if (!media) return null;
  if (media.kind === "video") {
    return { isVideo: true, imageUrl: media.variants.thumb ?? null, videoUrl: videoSrc(media) };
  }
  return { isVideo: false, imageUrl: media.variants[variant] ?? media.url, videoUrl: null };
}

function toStory(journey: PublicJourney, index: number): JourneyStory {
  return {
    id: journey.id,
    title: journey.name,
    quote: journey.quote ?? "",
    rating: journey.rating_text ?? "",
    albumTitle: journey.album_title ?? "",
    cover: toVisual(journey.cover, "card"),
    layout: LAYOUT_CYCLE[index % LAYOUT_CYCLE.length],
  };
}

export function toStories(list: PublicJourneyList | null): JourneyStory[] {
  if (!list) return [];
  const journeys = list.items ?? [...(list.recent ?? []), ...(list.more ?? [])];
  return journeys.map(toStory);
}

export function toAlbumPhotos(album: Album | undefined): JourneyAlbumPhoto[] {
  return (album?.items ?? []).flatMap((item, i) => {
    const visual = toVisual(item.media, "hero");
    return visual ? [{ ...visual, key: item.id ?? `${item.media?.id ?? item.media_id}-${i}`, caption: item.caption ?? "" }] : [];
  });
}
