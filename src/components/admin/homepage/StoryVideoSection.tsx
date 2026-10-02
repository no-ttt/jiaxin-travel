"use client";

import AdminSectionCard from "../ui/AdminSectionCard";
import AdminItemCard from "../ui/AdminItemCard";
import AdminTextInput from "../ui/AdminTextInput";
import AdminImageDropzone from "../ui/AdminImageDropzone";
import AdminAddButton from "../ui/AdminAddButton";
import { generateId } from "../ui/generateId";
import { useMediaUpload } from "../ui/useMediaUpload";
import type { StoryVideo } from "./data";

const MAX_VIDEOS = 3;

function VideoSourceToggle({
  sourceType,
  videoUrl,
  videoMediaId,
  onSourceTypeChange,
  onVideoUrlChange,
  onVideoMediaIdChange,
}: {
  sourceType: StoryVideo["source_type"];
  videoUrl: string | null;
  videoMediaId: string | null;
  onSourceTypeChange: (sourceType: StoryVideo["source_type"]) => void;
  onVideoUrlChange: (value: string) => void;
  onVideoMediaIdChange: (mediaId: string) => void;
}) {
  const { inputProps, dropProps, openPicker, isUploading, error } = useMediaUpload(
    "video",
    onVideoMediaIdChange
  );
  const uploadLabel = isUploading ? "上傳中…" : videoMediaId ? "已上傳影片，點擊更換" : "上傳影片檔";

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
            onClick={openPicker}
            disabled={isUploading}
            {...dropProps}
            className="flex h-[116px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[#E0E3E8] bg-[#FAFAFA] transition hover:border-[#0053E0]"
          >
            <span className="text-[22px] leading-[1.45em] text-[#0053E0]">＋</span>
            <span className="text-[13px] font-medium leading-[1.45em] text-[#0053E0]">{uploadLabel}</span>
          </button>
          <input {...inputProps} accept="video/mp4,video/quicktime" />
          <span className="text-xs leading-[1.45em] text-[#535F71]">
            {error ? <span className="text-red-600">{error}</span> : "支援 MP4 / MOV，檔案大小上限 200MB"}
          </span>
        </div>
      )}
    </div>
  );
}

export default function StoryVideoSection({
  value: videos,
  onChange: setVideos,
}: {
  value: StoryVideo[];
  onChange: (updater: (prev: StoryVideo[]) => StoryVideo[]) => void;
}) {
  const updateVideo = (id: string, patch: Partial<StoryVideo>) => {
    setVideos((prev) => prev.map((video) => (video._id === id ? { ...video, ...patch } : video)));
  };

  const addVideo = () => {
    setVideos((prev) =>
      prev.length >= MAX_VIDEOS
        ? prev
        : [
            ...prev,
            {
              _id: generateId("video"),
              title: "",
              source_type: "url",
              video_url: "",
              video_media_id: null,
              thumb_media_id: null,
            },
          ]
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
    setVideos((prev) => prev.filter((video) => video._id !== id));
  };

  return (
    <AdminSectionCard
      title="旅遊故事影音"
      description={`設定首頁「TRAVEL STORIES／旅程影像」區塊的影片，可貼上網址或直接上傳影片檔，最多 ${MAX_VIDEOS} 支。`}
    >
      {videos.map((video, index) => (
        <AdminItemCard
          key={video._id}
          badge={`影片 ${index + 1}`}
          actions={[
            { label: "上移", onClick: () => moveVideoUp(index), disabled: index === 0 },
            { label: "刪除", onClick: () => removeVideo(video._id) },
          ]}
        >
          <AdminTextInput
            label="影片標題"
            value={video.title}
            onChange={(value) => updateVideo(video._id, { title: value })}
          />
          <VideoSourceToggle
            sourceType={video.source_type}
            videoUrl={video.video_url}
            videoMediaId={video.video_media_id}
            onSourceTypeChange={(source_type) => updateVideo(video._id, { source_type })}
            onVideoUrlChange={(video_url) => updateVideo(video._id, { video_url })}
            onVideoMediaIdChange={(video_media_id) => updateVideo(video._id, { video_media_id })}
          />
          <AdminImageDropzone
            fieldLabel="影片縮圖（列表顯示用）"
            label="新增圖片"
            mediaId={video.thumb_media_id}
            onChange={(thumb_media_id) => updateVideo(video._id, { thumb_media_id })}
          />
        </AdminItemCard>
      ))}
      <AdminAddButton label="新增影片" onClick={addVideo} disabled={videos.length >= MAX_VIDEOS} />
    </AdminSectionCard>
  );
}
