import { mediaApi } from "./endpoints/media";
import type { Media, MediaPurpose } from "./types/media";

/** "auto" picks video for video files and image for everything else (e.g. mixed album uploads). */
export type UploadPurpose = MediaPurpose | "auto";

export const resolvePurpose = (file: File, purpose: UploadPurpose): MediaPurpose =>
  purpose === "auto" ? (file.type.startsWith("video/") ? "video" : "image") : purpose;

/**
 * Presigned upload flow:
 * 1. POST /admin/media/uploads → media_id + upload.url / upload.headers (valid ~15 min)
 * 2. PUT the file to upload.url — no Authorization header, the URL carries the signature
 * 3. POST /admin/media/complete — required; the backend validates the file and builds variants
 * The caller then stores media.id in the document field (e.g. banners[].media_id) and saves.
 */
export async function uploadMedia(file: File, purpose: UploadPurpose): Promise<Media> {
  const mime = file.type || "application/octet-stream";
  const { items } = await mediaApi.requestUploads({
    items: [{ purpose: resolvePurpose(file, purpose), mime, filename: file.name }],
  });
  const target = items[0];
  if (!target) throw new Error("無法取得上傳位置，請稍後再試");

  if (file.size > target.max_bytes) {
    throw new Error(`檔案超過上限 ${Math.round(target.max_bytes / 1024 / 1024)}MB`);
  }

  const res = await fetch(target.upload.url, {
    method: target.upload.method,
    headers: target.upload.headers,
    body: file,
  });
  if (!res.ok) throw new Error(`上傳失敗（${res.status}）`);

  const completed = await mediaApi.completeUploads({
    items: [{ media_id: target.media_id, size_bytes: file.size }],
  });
  const media = completed.items.find((item) => item.id === target.media_id);
  if (!media) throw new Error("檔案格式或大小不符，上傳被拒絕");
  return media;
}
