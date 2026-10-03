"use client";

import { useMedia } from "@/lib/api/hooks/useMedia";
import AdminSpinner from "../ui/AdminSpinner";
import { useMediaUpload } from "../ui/useMediaUpload";

export default function HeroImageField({
  mediaId,
  fallbackColor,
  onChange,
}: {
  mediaId: string | null;
  /** Shown behind the empty state, matching the public page when no hero is set. */
  fallbackColor: string;
  onChange: (mediaId: string | null) => void;
}) {
  const { data: media, isError: isMediaError } = useMedia(mediaId);
  const { inputProps, dropProps, openPicker, isUploading, error: uploadError } = useMediaUpload("image", onChange);
  const previewUrl = media ? (media.variants.hero ?? media.url) : null;
  const error = uploadError ?? (mediaId && isMediaError ? "圖片載入失敗，請移除後重新上傳" : null);

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">Hero 圖片</span>
      <div
        {...dropProps}
        className="relative h-[260px] w-full overflow-hidden rounded-[14px]"
        style={{ backgroundColor: fallbackColor }}
      >
        {previewUrl && !isUploading && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}

        {isUploading || (mediaId && !previewUrl && !isMediaError) ? (
          <AdminSpinner label={isUploading ? "圖片上傳中" : "圖片載入中"} />
        ) : mediaId ? (
          <div className="absolute inset-x-0 bottom-0 flex h-[52px] items-center justify-end bg-black/55 px-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openPicker}
                className="cursor-pointer text-xs font-bold leading-[1.45em] text-white"
              >
                更換圖片
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="cursor-pointer text-xs font-bold leading-[1.45em] text-white"
              >
                移除
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1.5 text-white/80 transition hover:text-white"
          >
            <span className="text-[22px] leading-[1.45em]">＋</span>
            <span className="text-[13px] font-medium leading-[1.45em]">上傳 Hero 圖片（未上傳時以主題顏色為底色）</span>
          </button>
        )}
        <input {...inputProps} accept="image/jpeg,image/png,image/webp" />
      </div>
      <p className="text-xs leading-[1.45em] text-[#535F71]">
        {error ? <span className="text-red-600">{error}</span> : "建議尺寸 1440×480px，檔案小於 5MB，支援 JPG／PNG／WebP"}
      </p>
    </div>
  );
}
