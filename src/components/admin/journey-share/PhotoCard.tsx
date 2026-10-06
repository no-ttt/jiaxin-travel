"use client";

import { useState } from "react";
import { useMedia } from "@/lib/api/hooks/useMedia";
import AdminSpinner from "../ui/AdminSpinner";
import type { JourneyMedia } from "./data";

export default function PhotoCard({
  media,
  index,
  onChange,
  onRemove,
}: {
  media: JourneyMedia;
  index: number;
  onChange: (patch: Partial<JourneyMedia>) => void;
  onRemove: () => void;
}) {
  const { data: file, isError } = useMedia(media.mediaId);
  const isVideo = file?.kind === "video";
  const thumbUrl = file ? (file.variants.thumb ?? (isVideo ? null : file.url)) : null;
  // A video without a generated thumbnail previews its first frame.
  const videoUrl = isVideo && !thumbUrl ? file.url : null;
  const previewUrl = thumbUrl ?? videoUrl;
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const isLoaded = previewUrl !== null && loadedUrl === previewUrl;
  const previewClass = `absolute inset-0 h-full w-full rounded-lg object-cover transition-opacity ${isLoaded ? "opacity-100" : "opacity-0"}`;

  return (
    <div className="flex w-[141px] flex-col gap-1.5">
      <div className="relative flex h-[141px] w-[141px] items-stretch overflow-hidden rounded-lg bg-[#ECF1FA]">
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
        <span className="absolute left-2 top-2 text-xs font-medium leading-none text-[#535F71]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="移除此媒體"
          className="absolute right-2 top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-[#E0E3E8] bg-white text-xs font-medium leading-none text-[#C71A1A]"
        >
          ×
        </button>
        {isVideo && (
          <span className="absolute bottom-2 left-2 flex items-center gap-[3px] rounded-lg bg-[#002366]/85 px-1.5 py-[3px] text-white">
            <span className="text-[8px] leading-none">▶</span>
            <span className="text-[10px] font-medium leading-none">影片</span>
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
