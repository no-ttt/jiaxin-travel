"use client";

import { useState } from "react";
import { useMedia } from "@/lib/api/hooks/useMedia";
import type { MediaPurpose } from "@/lib/api/types/media";
import AdminSpinner from "./AdminSpinner";
import { useMediaUpload } from "./useMediaUpload";

type AdminImageDropzoneProps = {
  fieldLabel?: string;
  label: string;
  hint?: string;
  size?: "sm" | "lg";
  hintPosition?: "below" | "beside";
  mediaId?: string | null;
  onChange?: (mediaId: string | null) => void;
  purpose?: MediaPurpose;
  accept?: string;
};

export default function AdminImageDropzone({
  fieldLabel,
  label,
  hint = "支援 JPG / PNG",
  size = "lg",
  hintPosition = "below",
  mediaId,
  onChange,
  purpose = "image",
  accept = "image/*",
}: AdminImageDropzoneProps) {
  const boxClass = size === "sm" ? "h-[88px] w-[88px]" : "h-[116px] w-[288px]";
  const { data: media, isError: isMediaError } = useMedia(mediaId);
  const { inputProps, dropProps, openPicker, isUploading, error: uploadError } = useMediaUpload(
    purpose,
    onChange
  );
  const previewUrl = media ? (media.variants.thumb ?? media.url) : null;
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const isLoaded = previewUrl !== null && loadedUrl === previewUrl;
  // A deleted/unreachable media record never yields a URL: stop spinning and let the admin remove it.
  const showSpinner = isUploading || (Boolean(mediaId) && !isLoaded && !isMediaError);
  const error = uploadError ?? (mediaId && isMediaError ? "圖片載入失敗，請移除後重新上傳" : null);

  const dropzone = (
    <div className={`relative ${boxClass}`}>
      <button
        type="button"
        onClick={onChange ? openPicker : undefined}
        disabled={isUploading}
        {...dropProps}
        className={`flex ${boxClass} cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[10px] border border-dashed border-[#E0E3E8] bg-[#FAFAFA] px-4 py-[22px] transition hover:border-[#0053E0] disabled:cursor-wait`}
      >
        {previewUrl && !isUploading && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt=""
            onLoad={() => setLoadedUrl(previewUrl)}
            onError={() => setLoadedUrl(previewUrl)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity ${isLoaded ? "opacity-100" : "opacity-0"}`}
          />
        )}
        {showSpinner ? (
          <AdminSpinner label="圖片載入中" />
        ) : (
          !mediaId && (
            <>
              <span className="text-[22px] leading-[1.45em] text-[#0053E0]">＋</span>
              <span className="text-[13px] font-medium leading-[1.45em] text-[#0053E0]">{label}</span>
            </>
          )
        )}
      </button>
      {mediaId && onChange && !isUploading && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/50 text-xs leading-none text-white"
          aria-label="移除圖片"
        >
          ×
        </button>
      )}
      <input {...inputProps} accept={accept} />
    </div>
  );

  const hintText = error ? <span className="text-red-600">{error}</span> : hint;

  if (hintPosition === "beside") {
    return (
      <div className="flex flex-col gap-2">
        {fieldLabel && <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">{fieldLabel}</span>}
        <div className="flex items-end gap-2">
          {dropzone}
          <span className="text-xs leading-[1.45em] text-[#535F71]">{hintText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {fieldLabel && <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">{fieldLabel}</span>}
      {dropzone}
      <span className="text-xs leading-[1.45em] text-[#535F71]">{hintText}</span>
    </div>
  );
}
