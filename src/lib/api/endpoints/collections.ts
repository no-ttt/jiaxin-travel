import { apiFetch } from "../client";
import type { Paginated } from "../types/common";
import type { AddTripIn, Collection, CollectionUpdate, ReorderIn } from "../types/collection";
import type { Trip } from "../types/trip";

export const collectionsApi = {
  // admin:collections
  get: (collectionId: string) => apiFetch<Collection>(`/admin/collections/${collectionId}`),

  update: (collectionId: string, payload: CollectionUpdate) =>
    apiFetch<Collection>(`/admin/collections/${collectionId}`, {
      method: "PATCH",
      body: payload,
    }),

  searchTripsForCollection: (collectionId: string, keyword: string) =>
    apiFetch<Paginated<Trip>>(
      `/admin/collections/${collectionId}/trip-search?keyword=${encodeURIComponent(keyword)}`,
    ),

  addTrip: (collectionId: string, payload: AddTripIn) =>
    apiFetch<void>(`/admin/collections/${collectionId}/items`, {
      method: "POST",
      body: payload,
    }),

  reorder: (collectionId: string, payload: ReorderIn) =>
    apiFetch<void>(`/admin/collections/${collectionId}/items/order`, {
      method: "PUT",
      body: payload,
    }),

  removeTrip: (collectionId: string, tripId: string) =>
    apiFetch<void>(`/admin/collections/${collectionId}/items/${tripId}`, {
      method: "DELETE",
    }),

  // public:collections
  publicGet: (slug: string) =>
    apiFetch<Collection>(`/public/collections/${slug}`, { auth: false }),
};
