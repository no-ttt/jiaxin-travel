import { apiFetch } from "../client";
import type {
  AddTripIn,
  Collection,
  CollectionTrip,
  CollectionUpdate,
  PublicCollection,
  PublicCollectionParams,
  ReorderIn,
} from "../types/collection";
import type { Media } from "../types/media";

type Raw = Record<string, unknown>;

const str = (value: unknown): string => (typeof value === "string" ? value : "");
const strOrNull = (value: unknown): string | null => (typeof value === "string" && value ? value : null);
const num = (value: unknown): number | null => (typeof value === "number" ? value : null);
const isMedia = (value: unknown): value is Media =>
  typeof value === "object" && value !== null && typeof (value as Raw).url === "string";

/**
 * Admin collection `items` and trip-search rows (confirmed): `{ trip_id, trip_code, product_name,
 * price_from, currency }` with no cover image. Read leniently in case covers are added later.
 */
function toCollectionTrip(raw: Raw): CollectionTrip {
  const trip = (typeof raw.trip === "object" && raw.trip !== null ? raw.trip : raw) as Raw;
  const cover = [trip.cover, trip.cover_media, raw.cover].find(isMedia);
  return {
    id: str(raw.trip_id) || str(trip.id),
    trip_code: str(trip.trip_code),
    product_name: str(trip.product_name) || str(trip.title),
    price_from: num(trip.price_from),
    currency: str(trip.currency),
    thumbnail: cover ? (cover.variants.thumb ?? cover.url) : strOrNull(trip.thumbnail_url),
  };
}

function tripRows(raw: unknown): Raw[] {
  if (Array.isArray(raw)) return raw as Raw[];
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Raw;
    for (const key of ["items", "trips"]) {
      if (Array.isArray(obj[key])) return obj[key] as Raw[];
    }
  }
  return [];
}

function toCollection(raw: Raw): Collection {
  const hero = [raw.hero, raw.hero_media].find(isMedia) ?? null;
  return {
    id: num(raw.id) ?? 0,
    slug: str(raw.slug),
    kind: str(raw.kind),
    title: str(raw.title),
    subtitle: str(raw.subtitle),
    tag_text: str(raw.tag_text),
    theme_color: strOrNull(raw.theme_color),
    button_color: strOrNull(raw.button_color),
    hero_media_id: strOrNull(raw.hero_media_id) ?? hero?.id ?? null,
    hero,
    trips: tripRows(raw).map(toCollectionTrip).filter((trip) => trip.id),
  };
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const collectionsApi = {
  // admin:collections
  get: (collectionId: number) =>
    apiFetch<Raw>(`/admin/collections/${collectionId}`).then(toCollection),

  update: (collectionId: number, payload: CollectionUpdate) =>
    apiFetch<unknown>(`/admin/collections/${collectionId}`, {
      method: "PATCH",
      body: payload,
    }),

  /** 以團號或團名搜尋可加入的行程（僅已上架）。 */
  searchTripsForCollection: (collectionId: number, q: string) =>
    apiFetch<unknown>(`/admin/collections/${collectionId}/trip-search${buildQuery({ q })}`).then((res) =>
      tripRows(res).map(toCollectionTrip).filter((trip) => trip.id),
    ),

  addTrip: (collectionId: number, payload: AddTripIn) =>
    apiFetch<unknown>(`/admin/collections/${collectionId}/items`, {
      method: "POST",
      body: payload,
    }),

  reorder: (collectionId: number, payload: ReorderIn) =>
    apiFetch<unknown>(`/admin/collections/${collectionId}/items/order`, {
      method: "PUT",
      body: payload,
    }),

  removeTrip: (collectionId: number, tripId: string) =>
    apiFetch<unknown>(`/admin/collections/${collectionId}/items/${tripId}`, {
      method: "DELETE",
    }),

  // public:collections
  publicGet: (slug: string, params: PublicCollectionParams = {}) =>
    apiFetch<PublicCollection>(
      `/public/collections/${encodeURIComponent(slug)}${buildQuery(params)}`,
      { auth: false },
    ),
};
