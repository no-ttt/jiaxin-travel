import { apiFetch } from "../client";
import type {
  CompleteRequest,
  CompleteResponse,
  Media,
  UploadRequest,
  UploadResponse,
} from "../types/media";

export const mediaApi = {
  requestUploads: (payload: UploadRequest) =>
    apiFetch<UploadResponse>("/admin/media/uploads", { method: "POST", body: payload }),

  completeUploads: (payload: CompleteRequest) =>
    apiFetch<CompleteResponse>("/admin/media/complete", { method: "POST", body: payload }),

  get: (mediaId: string) => apiFetch<Media>(`/admin/media/${mediaId}`),
};
