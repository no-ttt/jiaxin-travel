import AdminTextInput from "../ui/AdminTextInput";
import { generateId } from "../ui/generateId";
import PhotoCard from "./PhotoCard";
import type { JourneyCard } from "./data";

export default function ItemEditor({
  item,
  onChange,
  onDelete,
}: {
  item: JourneyCard;
  onChange: (patch: Partial<JourneyCard>) => void;
  onDelete?: () => void;
}) {
  const updateMedia = (id: string, patch: Partial<JourneyCard["media"][number]>) => {
    onChange({
      media: item.media.map((media) => (media.id === id ? { ...media, ...patch } : media)),
    });
  };

  const removeMedia = (id: string) => {
    onChange({ media: item.media.filter((media) => media.id !== id) });
  };

  const addMedia = () => {
    onChange({
      media: [...item.media, { id: generateId("media"), caption: "", isVideo: false }],
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

      <AdminTextInput
        label="封面圖片／影片（點擊卡片右上角圖示表示為影片素材）"
        value={item.coverLabel}
        placeholder="點擊更換圖片或影片檔案…"
        onChange={(coverLabel) => onChange({ coverLabel })}
      />

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

      <button
        type="button"
        onClick={addMedia}
        className="flex h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed border-[#E0E3E8] bg-[#FAFAFA] px-0 py-8 transition hover:border-[#0053E0]"
      >
        <span className="text-sm font-medium leading-[1.45em] text-[#002366]">
          拖曳多張照片或影片至此，或點擊選擇檔案
        </span>
        <span className="text-xs leading-[1.45em] text-[#535F71]">
          支援一次選取多張圖片（JPG／PNG）或影片（MP4／MOV），將依選取順序加入相簿末端
        </span>
      </button>

      <span className="text-[13px] font-medium leading-[1.45em] text-[#535F71]">
        已上傳相片／影片　共 {item.media.length} 則
      </span>

      {item.media.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-4">
          {item.media.map((media, index) => (
            <PhotoCard
              key={media.id}
              media={media}
              index={index}
              onChange={(patch) => updateMedia(media.id, patch)}
              onRemove={() => removeMedia(media.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
