"use client";

import { useState } from "react";
import AdminSectionCard from "../ui/AdminSectionCard";
import AdminItemCard from "../ui/AdminItemCard";
import AdminTextInput from "../ui/AdminTextInput";
import AdminImageDropzone from "../ui/AdminImageDropzone";
import AdminAddButton from "../ui/AdminAddButton";
import { generateId } from "../ui/generateId";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import { INITIAL_HOMEPAGE_VIDEOS, type StoryVideo } from "./data";

const MAX_VIDEOS = 3;

function VideoSourceToggle({
  sourceType,
  videoUrl,
  onSourceTypeChange,
  onVideoUrlChange,
}: {
  sourceType: StoryVideo["sourceType"];
  videoUrl?: string;
  onSourceTypeChange: (sourceType: StoryVideo["sourceType"]) => void;
  onVideoUrlChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSourceTypeChange("url")}
          className={`flex h-9 cursor-pointer items-center justify-center rounded-lg px-4 text-[13px] font-medium leading-[1.45em] transition ${
            sourceType === "url" ? "bg-[#0053E0] text-white" : "border border-[#D9DEE5] bg-white text-[#535F71]"
          }`}
        >
          🔗 貼上網址
        </button>
        <button
          type="button"
          onClick={() => onSourceTypeChange("upload")}
          className={`flex h-9 cursor-pointer items-center justify-center rounded-lg px-4 text-[13px] font-medium leading-[1.45em] transition ${
            sourceType === "upload" ? "bg-[#0053E0] text-white" : "border border-[#D9DEE5] bg-white text-[#535F71]"
          }`}
        >
          ⬆ 上傳影片檔
        </button>
      </div>

      {sourceType === "url" ? (
        <AdminTextInput
          label="影片網址（YouTube / Vimeo 連結）"
          value={videoUrl ?? ""}
          placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
          onChange={onVideoUrlChange}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">影片檔案</span>
          <button
            type="button"
            className="flex h-[116px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[#E0E3E8] bg-[#FAFAFA] transition hover:border-[#0053E0]"
          >
            <span className="text-[22px] leading-[1.45em] text-[#0053E0]">＋</span>
            <span className="text-[13px] font-medium leading-[1.45em] text-[#0053E0]">上傳影片檔</span>
          </button>
          <span className="text-xs leading-[1.45em] text-[#535F71]">支援 MP4 / MOV，檔案大小上限 200MB</span>
        </div>
      )}
    </div>
  );
}

export default function StoryVideoSection({
  onDirtyChange,
  resetKey,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  resetKey?: unknown;
}) {
  const [videos, setVideos] = useState<StoryVideo[]>(INITIAL_HOMEPAGE_VIDEOS);
  useDirtyTracking(videos, onDirtyChange, resetKey);

  const updateVideo = (id: string, patch: Partial<StoryVideo>) => {
    setVideos((prev) => prev.map((video) => (video.id === id ? { ...video, ...patch } : video)));
  };

  const addVideo = () => {
    setVideos((prev) =>
      prev.length >= MAX_VIDEOS
        ? prev
        : [...prev, { id: generateId("video"), title: "", sourceType: "url", videoUrl: "" }]
    );
  };

  const moveVideoUp = (index: number) => {
    if (index === 0) return;
    setVideos((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const removeVideo = (id: string) => {
    setVideos((prev) => prev.filter((video) => video.id !== id));
  };

  return (
    <AdminSectionCard
      title="旅遊故事影音"
      description={`設定首頁「TRAVEL STORIES／旅程影像」區塊的影片，可貼上網址或直接上傳影片檔，最多 ${MAX_VIDEOS} 支。`}
    >
      {videos.map((video, index) => (
        <AdminItemCard
          key={video.id}
          badge={`影片 ${index + 1}`}
          actions={[
            { label: "上移", onClick: () => moveVideoUp(index), disabled: index === 0 },
            { label: "刪除", onClick: () => removeVideo(video.id) },
          ]}
        >
          <AdminTextInput
            label="影片標題"
            value={video.title}
            onChange={(value) => updateVideo(video.id, { title: value })}
          />
          <VideoSourceToggle
            sourceType={video.sourceType}
            videoUrl={video.videoUrl}
            onSourceTypeChange={(sourceType) => updateVideo(video.id, { sourceType })}
            onVideoUrlChange={(videoUrl) => updateVideo(video.id, { videoUrl })}
          />
          <AdminImageDropzone fieldLabel="影片縮圖（列表顯示用）" label="新增圖片" />
        </AdminItemCard>
      ))}
      <AdminAddButton label="新增影片" onClick={addVideo} disabled={videos.length >= MAX_VIDEOS} />
    </AdminSectionCard>
  );
}
