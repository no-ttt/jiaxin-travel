import AdminSectionCard from "../ui/AdminSectionCard";
import AdminTextInput from "../ui/AdminTextInput";
import AdminTextarea from "../ui/AdminTextarea";

export default function BasicInfoSection({
  title,
  subtitle,
  badgeText,
  onTitleChange,
  onSubtitleChange,
  onBadgeTextChange,
}: {
  title: string;
  subtitle: string;
  badgeText: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onBadgeTextChange: (value: string) => void;
}) {
  return (
    <AdminSectionCard title="基本資訊" description="設定集合頁的標題、副標題與首圖標籤文字。">
      <AdminTextInput label="標題" value={title} onChange={onTitleChange} />
      <AdminTextarea label="副標題" value={subtitle} rows={3} onChange={onSubtitleChange} />
      <AdminTextInput
        label="標籤文字（顯示於首圖上的圓角標籤）"
        value={badgeText}
        onChange={onBadgeTextChange}
      />
    </AdminSectionCard>
  );
}
