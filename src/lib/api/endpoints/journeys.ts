import { apiFetch } from "../client";
import { toItems, type ItemsResponse } from "../types/common";
import type {
  Album,
  AlbumAppendIn,
  AlbumReplaceIn,
  Journey,
  JourneyIn,
  PublicJourneyList,
} from "../types/journey";

export const journeysApi = {
  // admin:journeys
  list: async () => toItems(await apiFetch<Journey[] | ItemsResponse<Journey>>("/admin/journeys")),

  create: (payload: JourneyIn) =>
    apiFetch<Journey>("/admin/journeys", { method: "POST", body: payload }),

  update: (journeyId: string, payload: Partial<JourneyIn>) =>
    apiFetch<Journey>(`/admin/journeys/${journeyId}`, { method: "PATCH", body: payload }),

  remove: (journeyId: string) =>
    apiFetch<void>(`/admin/journeys/${journeyId}`, { method: "DELETE" }),

  getAlbum: (journeyId: string) => apiFetch<Album>(`/admin/journeys/${journeyId}/album`),

  replaceAlbum: (journeyId: string, payload: AlbumReplaceIn) =>
    apiFetch<void>(`/admin/journeys/${journeyId}/album`, { method: "PUT", body: payload }),

  appendAlbumItems: (journeyId: string, payload: AlbumAppendIn) =>
    apiFetch<void>(`/admin/journeys/${journeyId}/album/items`, {
      method: "POST",
      body: payload,
    }),

  // public:journeys
  publicList: () => apiFetch<PublicJourneyList>("/public/journeys", { auth: false }),

  publicAlbum: (journeyId: string) =>
    apiFetch<Album>(`/public/journeys/${journeyId}/album`, { auth: false }),
};
