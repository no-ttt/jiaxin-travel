"use client";

import { useState, type DragEvent } from "react";
import { useMedia } from "@/lib/api/hooks/useMedia";
import AdminSpinner from "@/components/admin/ui/AdminSpinner";
import { useMediaUpload } from "@/components/admin/ui/useMediaUpload";

/** Existing image tile (gradient box + remove button) that now previews the uploaded media. */
export function TripImagePreview({
  mediaId,
  onRemove,
  removeClassName,
  dragHandleProps,
}: {
  mediaId: string;
  onRemove: () => void;
  removeClassName: string;
  dragHandleProps?: ReturnType<ReturnType<typeof useImageReorder>["handleProps"]>;
}) {
  const { data: media } = useMedia(mediaId);
  const url = media ? (media.variants.card ?? media.url) : null;
  // Track which url finished loading, so a new url shows the spinner again.
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const isLoaded = url !== null && loadedUrl === url;

  return (
    <div
      {...dragHandleProps}
      className={`relative h-[116px] w-full overflow-hidden rounded-[10px] border border-[#E0E3E8] bg-[#F6F6F6] ${
        dragHandleProps ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          draggable={false}
          onLoad={() => setLoadedUrl(url)}
          onError={() => setLoadedUrl(url)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${isLoaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {!isLoaded && <AdminSpinner label="圖片載入中" />}
      <button type="button" onClick={onRemove} aria-label="移除圖片" className={removeClassName}>
        ×
      </button>
    </div>
  );
}

/** Existing "＋ 新增圖片" tile, wired to upload a file and hand back its media id. */
export function AddImageTile({ onUploaded }: { onUploaded: (mediaId: string) => void }) {
  const { inputProps, dropProps, openPicker, isUploading, error } = useMediaUpload(
    "image",
    onUploaded
  );

  return (
    <div className="flex w-[288px] flex-col gap-2">
      <button
        type="button"
        onClick={openPicker}
        disabled={isUploading}
        {...dropProps}
        className="relative flex h-[116px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[#E0E3E8] bg-[#FAFAFA] hover:border-[#0053E0] disabled:cursor-wait"
      >
        {isUploading ? (
          <AdminSpinner label="上傳中" />
        ) : (
          <>
            <span className="text-[22px] leading-[1.45em] text-[#0053E0]">＋</span>
            <span className="text-[13px] font-medium leading-[1.45em] text-[#0053E0]">新增圖片</span>
          </>
        )}
      </button>
      <input {...inputProps} accept="image/jpeg,image/png" />
      <span className="text-xs leading-[1.45em] text-[#535F71]">
        {error ? <span className="text-red-600">{error}</span> : "支援 JPG / PNG"}
      </span>
    </div>
  );
}

/**
 * Drag-to-reorder for image tiles. The preview box is the drag handle (so caption inputs stay
 * selectable) and the whole tile is the drop target. Events stop propagating so an enclosing
 * draggable card (e.g. feature cards) doesn't also react.
 */
export function useImageReorder(onMove: (fromId: string, toId: string) => void) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const reset = () => {
    setDraggingId(null);
    setOverId(null);
  };

  return {
    handleProps: (id: string) => ({
      draggable: true,
      onDragStart: (e: DragEvent) => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = "move";
        setDraggingId(id);
      },
      onDragEnd: (e: DragEvent) => {
        e.stopPropagation();
        reset();
      },
    }),
    dropProps: (id: string) => ({
      onDragOver: (e: DragEvent) => {
        if (!draggingId) return;
        e.preventDefault();
        e.stopPropagation();
        if (draggingId !== id) setOverId(id);
      },
      onDragLeave: () => setOverId((prev) => (prev === id ? null : prev)),
      onDrop: (e: DragEvent) => {
        if (!draggingId) return;
        e.preventDefault();
        e.stopPropagation();
        if (draggingId !== id) onMove(draggingId, id);
        reset();
      },
    }),
    tileClass: (id: string) =>
      [
        draggingId === id ? "opacity-50" : "",
        overId === id && draggingId !== id ? "rounded-[10px] outline outline-2 outline-offset-2 outline-[#0053E0]" : "",
      ].join(" "),
  };
}
