"use client";

import { useMedia } from "@/lib/api/hooks/useMedia";
import { useMediaUpload } from "./useMediaUpload";

/** Card name: the original name when the API returns it, else the last part of the URL. */
const fileNameOf = (url: string, filename?: string | null) =>
  filename || decodeURIComponent(url.split("?")[0].split("/").pop() ?? "");

/**
 * A downloadable file (PDF / JPG / PNG): a dashed drop zone when empty, the file card with a
 * remove button once set. `fallbackUrl` shows a file that was given as a plain link instead.
 */
export default function AdminFileUpload({
  mediaId,
  fallbackUrl = "",
  onUploaded,
  onRemove,
}: {
  mediaId: string | null;
  fallbackUrl?: string;
  onUploaded: (mediaId: string) => void;
  onRemove: () => void;
}) {
  const { data: media } = useMedia(mediaId);
  const upload = useMediaUpload("auto", onUploaded);
  const fileUrl = mediaId ? media?.url : fallbackUrl || undefined;
  const hasFile = Boolean(mediaId || fallbackUrl);

  return (
    <>
      {hasFile && !upload.isUploading ? (
        <div className="flex items-center gap-2 rounded-[10px] border border-[#C3C6D6] bg-[#F9FAFC] py-2.5 pl-4 pr-2.5">
          {fileUrl ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1 truncate text-sm text-[#090909] hover:underline"
            >
              {fileNameOf(fileUrl, mediaId ? media?.filename : null)}
            </a>
          ) : (
            <span className="min-w-0 flex-1 truncate text-sm text-[#535F71]">檔案載入中…</span>
          )}
          <button
            type="button"
            onClick={onRemove}
            aria-label="移除檔案"
            className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#E0E3E8] bg-white text-[13px] font-medium leading-none text-[#C71A1A] hover:bg-[#FDEDED]"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          {...upload.dropProps}
          onClick={upload.openPicker}
          disabled={upload.isUploading}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed border-[#E0E3E8] bg-[#FAFAFA] px-3 py-4 text-[#0053E0] hover:border-[#0053E0] disabled:cursor-wait"
        >
          {upload.isUploading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#E0E3E8] border-t-[#0053E0]" />
          ) : (
            <>
              <span className="text-xl leading-none">＋</span>
              <span className="text-xs font-medium">上傳檔案（PDF / JPG / PNG）</span>
            </>
          )}
        </button>
      )}
      <input {...upload.inputProps} accept="application/pdf,image/jpeg,image/png" />
      {upload.error && <p className="text-xs text-[#C71A1A]">{upload.error}</p>}
    </>
  );
}
