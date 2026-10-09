export type MediaPurpose = "image" | "icon" | "video" | "pdf";

export type UploadRequestItem = {
  purpose: MediaPurpose;
  mime: string;
  filename?: string;
};

export type UploadRequest = {
  items: UploadRequestItem[];
};

/** Confirmed against POST /admin/media/uploads — a presigned PUT target (upload.url). */
export type UploadTarget = {
  media_id: string;
  s3_key: string;
  kind: string;
  max_bytes: number;
  upload: {
    method: "PUT";
    url: string;
    headers: Record<string, string>;
  };
};

export type UploadResponse = {
  items: UploadTarget[];
};

export type CompleteItem = {
  media_id: string;
  size_bytes?: number | null;
};

export type CompleteRequest = {
  items: CompleteItem[];
};

/** Confirmed against GET /admin/media/{id} and POST /admin/media/complete. */
export type Media = {
  id: string;
  kind: string;
  mime: string;
  url: string;
  width: number | null;
  height: number | null;
  /** Images: card / hero / thumb. Videos other than MP4 (e.g. MOV): `web`, an MP4 transcode. */
  variants: Partial<Record<"card" | "hero" | "thumb" | "web", string>>;
  transcode_status: string;
};

/** Playable source for a video: the MP4 transcode when the upload wasn't MP4 (browsers can't all play MOV). */
export const videoSrc = (media: Media): string => media.variants.web ?? media.url;

export type CompleteResponse = {
  items: Media[];
  rejected: unknown[];
};
