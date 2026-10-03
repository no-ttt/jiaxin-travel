import AdminSectionCard from "../ui/AdminSectionCard";
import AdminTextInput from "../ui/AdminTextInput";
import AdminTextarea from "../ui/AdminTextarea";

export default function BasicInfoSection({
  title,
  titleError,
  subtitle,
  badgeText,
  onTitleChange,
  onSubtitleChange,
  onBadgeTextChange,
}: {
  title: string;
  /** Shown under the title field (the title is the public page's headline, so it is required). */
  titleError: string | null;
  subtitle: string;
  badgeText: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onBadgeTextChange: (value: string) => void;
}) {
  return (
    <AdminSectionCard title="基本資訊" description="設定集合頁的標題、副標題與首圖標籤文字。">
      <div className="flex flex-col gap-1.5">
        <AdminTextInput label="標題" value={title} onChange={onTitleChange} />
        {titleError && <p className="text-xs leading-[1.45em] text-[#D92D20]">{titleError}</p>}
      </div>
      <AdminTextarea label="副標題" value={subtitle} rows={3} onChange={onSubtitleChange} />
      <AdminTextInput
        label="標籤文字（顯示於首圖上的圓角標籤）"
        value={badgeText}
        onChange={onBadgeTextChange}
      />
    </AdminSectionCard>
  );
}
