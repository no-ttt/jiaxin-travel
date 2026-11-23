"use client";

import { useState } from "react";
import AdminFileUpload from "@/components/admin/ui/AdminFileUpload";
import type { EditableDownload } from "./data";

type Source = "url" | "upload";

/**
 * 「下載檔案 N 連結網址／檔案」: pick 貼上網址 (a typed link) or 上傳檔案 (PDF / JPG / PNG media).
 * Switching clears the other source, since the API serves the uploaded file whenever one is set.
 */
export default function DownloadSourceField({
  index,
  file,
  onChange,
}: {
  index: number;
  file: EditableDownload;
  onChange: (patch: Partial<EditableDownload>) => void;
}) {
  const [source, setSource] = useState<Source>(file.url && !file.media_id ? "url" : "upload");

  const choose = (next: Source) => {
    if (next === source) return;
    setSource(next);
    onChange(next === "url" ? { media_id: null } : { url: "" });
  };

  const toggleClass = (active: boolean) =>
    `flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-[13px] font-medium ${
      active ? "bg-[#0053E0] text-white" : "border border-[#D9DEE5] bg-white text-[#535F71] hover:bg-[#F6F6F6]"
    }`;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
      <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">下載檔案 {index + 1}　連結網址／檔案</span>
      <div className="flex gap-2">
        <button type="button" onClick={() => choose("url")} className={toggleClass(source === "url")}>
          貼上網址
        </button>
        <button type="button" onClick={() => choose("upload")} className={toggleClass(source === "upload")}>
          ⬆ 上傳檔案
        </button>
      </div>

      {source === "url" ? (
        <input
          type="text"
          value={file.url}
          onChange={(e) => onChange({ url: e.target.value, media_id: null })}
          placeholder="請輸入下載連結網址"
          className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none placeholder:text-[#535F71] focus:border-[#0053E0]"
        />
      ) : (
        <AdminFileUpload
          mediaId={file.media_id}
          onUploaded={(mediaId) => onChange({ media_id: mediaId, url: "" })}
          onRemove={() => onChange({ media_id: null })}
        />
      )}
    </div>
  );
}
