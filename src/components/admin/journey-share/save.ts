import { journeysApi } from "@/lib/api/endpoints/journeys";
import type { AlbumReplaceIn, JourneyIn } from "@/lib/api/types/journey";
import type { JourneyCard } from "./data";

/** One API request (or a create followed by its album) produced by diffing the draft against the server copy. */
export type SaveOp = { run: () => Promise<unknown> };

function journeyPayload(card: JourneyCard, position: number): JourneyIn {
  return {
    name: card.name.trim(),
    visible: card.visible,
    position,
    cover_media_id: card.coverMediaId,
    quote: card.review.trim(),
    rating_text: card.rating.trim(),
    album_title: card.albumTitle.trim(),
  };
}

function albumPayload(card: JourneyCard): AlbumReplaceIn {
  return {
    items: card.media.map((media) => ({ media_id: media.mediaId, caption: media.caption.trim() })),
    album_title: card.albumTitle.trim(),
  };
}

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function buildSaveOps(base: JourneyCard[], draft: JourneyCard[]): SaveOp[] {
  const ops: SaveOp[] = [];

  draft.forEach((card, position) => {
    const payload = journeyPayload(card, position);
    const album = albumPayload(card);

    if (card.id == null) {
      ops.push({
        run: async () => {
          const created = await journeysApi.create(payload);
          if (album.items.length > 0) await journeysApi.replaceAlbum(created.id, album);
        },
      });
      return;
    }

    const id = card.id;
    const baseIndex = base.findIndex((b) => b.id === id);
    if (baseIndex === -1) return;
    const original = base[baseIndex];
    // Compare against the server copy's own position (its index in the sorted list).
    if (!sameJson(payload, journeyPayload(original, baseIndex))) {
      ops.push({ run: () => journeysApi.update(id, payload) });
    }
    if (!sameJson(album, albumPayload(original))) {
      ops.push({ run: () => journeysApi.replaceAlbum(id, album) });
    }
  });

  for (const original of base) {
    const id = original.id;
    if (id != null && !draft.some((card) => card.id === id)) {
      ops.push({ run: () => journeysApi.remove(id) });
    }
  }

  return ops;
}

/** Runs every op concurrently; returns the errors of the ones that failed. */
export async function runSaveOps(ops: SaveOp[]): Promise<unknown[]> {
  const results = await Promise.allSettled(ops.map((op) => op.run()));
  return results.flatMap((result) => (result.status === "rejected" ? [result.reason] : []));
}
