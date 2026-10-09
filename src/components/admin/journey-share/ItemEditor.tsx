"use client";

import { useState, type DragEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminSpinner from "../ui/AdminSpinner";
import AdminTextInput from "../ui/AdminTextInput";
import PhotoCard, { MediaThumb } from "./PhotoCard";
import { createJourneyMedia, type CardPatch, type JourneyCard, type JourneyMedia } from "./data";
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

/** The current cover, picked from the album below ("照片素材・素材 01"). */
function CoverSummary({ mediaId, media }: { mediaId: string | null; media: JourneyMedia[] }) {
  const { data: file } = useMedia(mediaId);
  const index = media.findIndex((item) => item.mediaId === mediaId);
  const kindLabel = file ? (file.kind === "video" ? "影片素材" : "照片素材") : "";
  const label = index === -1 ? kindLabel : `${kindLabel}・素材 ${String(index + 1).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-[7px]">
      <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">
        封面圖片／影片（於下方素材縮圖選擇，目前封面如下所示）
      </span>
      <div className="flex items-center gap-3">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[10px] bg-[#ECF1FA]">
          {mediaId && <MediaThumb key={mediaId} mediaId={mediaId} className="" />}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[#535F71]">目前封面</span>
          {mediaId && <span className="text-xs text-[#0A0A0C]">{label}</span>}
        </div>
      </div>
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
  // The first upload into a journey without a cover becomes its cover.
  const { upload, isUploading, error } = useAlbumUpload((mediaId) =>
    onChange((card) => ({
      media: [...card.media, createJourneyMedia(mediaId)],
      coverMediaId: card.coverMediaId ?? mediaId,
    }))
  );

  const updateMedia = (key: string, patch: Partial<JourneyCard["media"][number]>) => {
    onChange((card) => ({
      media: card.media.map((media) => (media.key === key ? { ...media, ...patch } : media)),
    }));
  };

  // Removing the album's last copy of the cover leaves the journey without one.
  const removeMedia = (key: string) => {
    onChange((card) => {
      const removed = card.media.find((item) => item.key === key);
      const media = card.media.filter((item) => item.key !== key);
      const coverGone =
        removed?.mediaId === card.coverMediaId && !media.some((item) => item.mediaId === card.coverMediaId);
      return { media, coverMediaId: coverGone ? null : card.coverMediaId };
    });
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

      <CoverSummary mediaId={item.coverMediaId} media={item.media} />

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
              isCover={media.mediaId === item.coverMediaId}
              onSetCover={() => onChange({ coverMediaId: media.mediaId })}
              onChange={(patch) => updateMedia(media.key, patch)}
              onRemove={() => removeMedia(media.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
