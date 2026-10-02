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
  variants: Partial<Record<"card" | "hero" | "thumb", string>>;
  transcode_status: string;
};

export type CompleteResponse = {
  items: Media[];
  rejected: unknown[];
};
