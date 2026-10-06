"use client";

import { useState, type DragEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminSpinner from "../ui/AdminSpinner";
import AdminTextInput from "../ui/AdminTextInput";
import { useMediaUpload } from "../ui/useMediaUpload";
import PhotoCard from "./PhotoCard";
import { createJourneyMedia, type CardPatch, type JourneyCard } from "./data";
import { mediaKey, useMedia } from "@/lib/api/hooks/useMedia";
import { uploadMedia } from "@/lib/api/upload";

const MEDIA_ACCEPT = "image/jpeg,image/png,video/mp4,video/quicktime";

/** Uploads files one by one (keeps the selection order) and appends each to the album as it lands. */
function useAlbumUpload(onUploaded: (mediaId: string) => void) {
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: File[]) => {
    if (files.length === 0) return;
    setError(null);
    setPending((n) => n + files.length);
    for (const file of files) {
      try {
        const media = await uploadMedia(file, "auto");
        queryClient.setQueryData(mediaKey(media.id), media);
        onUploaded(media.id);
      } catch (err) {
        setError(`${file.name}：${err instanceof Error ? err.message : "上傳失敗"}`);
      } finally {
        setPending((n) => n - 1);
      }
    }
  };

  return { upload, isUploading: pending > 0, error };
}

/** Cover picker styled as the design's text field: clicking (or dropping a file) uploads a new cover. */
function CoverField({ mediaId, onUploaded }: { mediaId: string | null; onUploaded: (mediaId: string) => void }) {
  const { inputProps, dropProps, openPicker, isUploading, error } = useMediaUpload("auto", onUploaded);
  const { data: media } = useMedia(mediaId);
  const text = isUploading
    ? "上傳中…"
    : mediaId
      ? `已上傳${media?.kind === "video" ? "影片" : "圖片"}，點擊更換`
      : "點擊更換圖片或影片檔案…";

  return (
    <div className="flex flex-col gap-[7px]">
      <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">
        封面圖片／影片（點擊卡片右上角圖示表示為影片素材）
      </span>
      <button
        type="button"
        onClick={openPicker}
        disabled={isUploading}
        {...dropProps}
        className="flex h-11 w-full cursor-pointer items-center rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-left text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none transition hover:border-[#0053E0] focus:border-[#0053E0] disabled:cursor-wait"
      >
        {text}
      </button>
      <input {...inputProps} accept={MEDIA_ACCEPT} />
      {error && <span className="text-xs leading-[1.45em] text-red-600">{error}</span>}
      {mediaId && !isUploading && <CoverPreview mediaId={mediaId} />}
    </div>
  );
}

/** Thumbnail of the uploaded cover; a video without a generated thumbnail shows its first frame. */
function CoverPreview({ mediaId }: { mediaId: string }) {
  const { data: media, isError } = useMedia(mediaId);
  const isVideo = media?.kind === "video";
  const thumbUrl = media ? (media.variants.thumb ?? (isVideo ? null : media.url)) : null;
  const videoUrl = isVideo && !thumbUrl ? media.url : null;
  const previewUrl = thumbUrl ?? videoUrl;
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const isLoaded = previewUrl !== null && loadedUrl === previewUrl;
  const previewClass = `absolute inset-0 h-full w-full object-cover transition-opacity ${isLoaded ? "opacity-100" : "opacity-0"}`;

  return (
    <div className="relative h-[116px] w-[208px] overflow-hidden rounded-lg bg-[#ECF1FA]">
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
      {isVideo && (
        <span className="absolute bottom-2 left-2 flex items-center gap-[3px] rounded-lg bg-[#002366]/85 px-1.5 py-[3px] text-white">
          <span className="text-[8px] leading-none">▶</span>
          <span className="text-[10px] font-medium leading-none">影片</span>
        </span>
      )}
    </div>
  );
}

export default function ItemEditor({
  item,
  onChange,
  onDelete,
}: {
  item: JourneyCard;
  onChange: (patch: CardPatch) => void;
  onDelete?: () => void;
}) {
  const { upload, isUploading, error } = useAlbumUpload((mediaId) =>
    onChange((card) => ({ media: [...card.media, createJourneyMedia(mediaId)] }))
  );

  const updateMedia = (key: string, patch: Partial<JourneyCard["media"][number]>) => {
    onChange((card) => ({
      media: card.media.map((media) => (media.key === key ? { ...media, ...patch } : media)),
    }));
  };

  const removeMedia = (key: string) => {
    onChange((card) => ({ media: card.media.filter((media) => media.key !== key) }));
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E0E3E8] bg-white p-[18px]">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-bold leading-[1.45em] text-[#090909]">
          目前編輯：{item.name || "未命名旅程"}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs leading-[1.45em] text-[#535F71]">切換上方項目即可編輯其他內容</span>
          {onDelete && (
            <>
              <span className="text-xs leading-[1.45em] text-[#535F71] opacity-50">｜</span>
              <button
                type="button"
                onClick={onDelete}
                className="cursor-pointer text-xs leading-[1.45em] text-[#535F71] hover:text-[#C71A1A]"
              >
                刪除此旅程
              </button>
            </>
          )}
        </div>
      </div>

      <AdminTextInput label="旅程名稱" value={item.name} onChange={(name) => onChange({ name })} />

      <CoverField mediaId={item.coverMediaId} onUploaded={(coverMediaId) => onChange({ coverMediaId })} />

      <AdminTextInput
        label="精選好評（滑鼠移入卡片時顯示）"
        value={item.review}
        placeholder="「領隊一路照顧得很細心，整團像朋友一起旅行。」"
        onChange={(review) => onChange({ review })}
      />

      <AdminTextInput
        label="評分（顯示星等文字）"
        value={item.rating}
        placeholder="★★★★★"
        onChange={(rating) => onChange({ rating })}
      />

      <div className="h-px w-full bg-[#E0E3E8]" />

      <span className="text-lg font-bold leading-[1.5em] text-[#090909]">旅程相簿內容</span>

      <AdminTextInput
        label="相簿標題（顯示於相簿視窗左上角）"
        value={item.albumTitle}
        onChange={(albumTitle) => onChange({ albumTitle })}
      />

      <span className="text-[15px] font-bold leading-[1.5em] text-[#090909]">相片／影片管理</span>
      <p className="text-[13px] leading-[1.5em] text-[#535F71]">
        可一次選取多張照片或影片上傳；上傳後將依序排列於相簿，可視情況為每則媒體補充說明文字（非必填）。
      </p>

      <label
        onDragOver={(e: DragEvent) => e.preventDefault()}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          void upload(Array.from(e.dataTransfer.files ?? []));
        }}
        className="relative flex h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed border-[#E0E3E8] bg-[#FAFAFA] px-0 py-8 transition hover:border-[#0053E0]"
      >
        {isUploading ? (
          <AdminSpinner label="上傳中" />
        ) : (
          <>
            <span className="text-sm font-medium leading-[1.45em] text-[#002366]">
              拖曳多張照片或影片至此，或點擊選擇檔案
            </span>
            <span className="text-xs leading-[1.45em] text-[#535F71]">
              支援一次選取多張圖片（JPG／PNG）或影片（MP4／MOV），將依選取順序加入相簿末端
            </span>
          </>
        )}
        <input
          type="file"
          hidden
          multiple
          accept={MEDIA_ACCEPT}
          onChange={(e) => {
            void upload(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </label>
      {error && <span className="text-xs leading-[1.45em] text-red-600">{error}</span>}

      <span className="text-[13px] font-medium leading-[1.45em] text-[#535F71]">
        已上傳相片／影片　共 {item.media.length} 則
      </span>

      {item.media.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-4">
          {item.media.map((media, index) => (
            <PhotoCard
              key={media.key}
              media={media}
              index={index}
              onChange={(patch) => updateMedia(media.key, patch)}
              onRemove={() => removeMedia(media.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
