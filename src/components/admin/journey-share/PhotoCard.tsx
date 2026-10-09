"use client";

import { useState } from "react";
import { useMedia } from "@/lib/api/hooks/useMedia";
import { videoSrc } from "@/lib/api/types/media";
import AdminSpinner from "../ui/AdminSpinner";
import type { JourneyMedia } from "./data";

/** Media preview filling its parent; a video without a generated thumbnail shows its first frame. */
export function MediaThumb({ mediaId, className }: { mediaId: string; className: string }) {
  const { data: file, isError } = useMedia(mediaId);
  const isVideo = file?.kind === "video";
  const thumbUrl = file ? (file.variants.thumb ?? (isVideo ? null : file.url)) : null;
  const videoUrl = isVideo && !thumbUrl ? videoSrc(file) : null;
  const previewUrl = thumbUrl ?? videoUrl;
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const isLoaded = previewUrl !== null && loadedUrl === previewUrl;
  const previewClass = `absolute inset-0 h-full w-full object-cover transition-opacity ${className} ${isLoaded ? "opacity-100" : "opacity-0"}`;

  return (
    <>
      {thumbUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbUrl}
          alt=""
          onLoad={() => setLoadedUrl(thumbUrl)}
          onError={() => setLoadedUrl(thumbUrl)}
          className={previewClass}
        />
      )}
      {videoUrl && (
        <video
          src={videoUrl}
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setLoadedUrl(videoUrl)}
          onError={() => setLoadedUrl(videoUrl)}
          className={previewClass}
        />
      )}
      {!isLoaded && !isError && <AdminSpinner label="圖片載入中" />}
    </>
  );
}

export default function PhotoCard({
  media,
  index,
  isCover,
  onSetCover,
  onChange,
  onRemove,
}: {
  media: JourneyMedia;
  index: number;
  isCover: boolean;
  onSetCover: () => void;
  onChange: (patch: Partial<JourneyMedia>) => void;
  onRemove: () => void;
}) {
  const { data: file } = useMedia(media.mediaId);
  const isVideo = file?.kind === "video";

  return (
    <div className="flex w-[141px] flex-col gap-1.5">
      <div className="group relative flex h-[141px] w-[141px] items-stretch overflow-hidden rounded-lg bg-[#ECF1FA]">
        <MediaThumb mediaId={media.mediaId} className="rounded-lg" />
        <span className="absolute left-2 top-2 text-xs font-medium leading-none text-[#535F71]">
          {String(index + 1).padStart(2, "0")}
        </span>
        {!isCover && (
          <button
            type="button"
            onClick={onSetCover}
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <span className="text-lg leading-none">☆</span>
            <span className="text-xs font-medium leading-none">設為相簿封面</span>
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label="移除此媒體"
          className="absolute right-2 top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-[#E0E3E8] bg-white text-xs font-medium leading-none text-[#C71A1A]"
        >
          ×
        </button>
        {isVideo && (
          <span className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-[3px] rounded-lg bg-[#002366]/85 px-1.5 py-[3px] text-white">
            <span className="text-[8px] leading-none">▶</span>
            <span className="text-[10px] font-medium leading-none">影片</span>
          </span>
        )}
        {isCover && (
          <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-[3px] rounded-lg bg-[#0053E0]/92 px-2 py-[3px] text-white">
            <span className="text-[9px] leading-none">★</span>
            <span className="text-[10px] font-medium leading-none">封面</span>
          </span>
        )}
      </div>
      <div className="flex h-[30px] items-center rounded-md border border-[#E0E3E8] bg-white px-2">
        <input
          type="text"
          value={media.caption}
          placeholder="說明（選填）"
          onChange={(e) => onChange({ caption: e.target.value })}
          className="w-[125px] bg-transparent text-[11px] leading-[1.45em] text-[#002366] outline-none placeholder:text-[#535F71]"
        />
      </div>
    </div>
  );
}
