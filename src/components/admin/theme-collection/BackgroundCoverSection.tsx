import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import ColorPickerField from "./ColorPickerField";
import HeroImageField from "./HeroImageField";
import { BUTTON_COLOR_PRESETS, THEME_COLOR_PRESETS } from "./data";

export default function BackgroundCoverSection({
  themeColor,
  buttonColor,
  heroImageName,
  onThemeColorChange,
  onButtonColorChange,
}: {
  themeColor: string;
  buttonColor: string;
  heroImageName: string;
  onThemeColorChange: (value: string) => void;
  onButtonColorChange: (value: string) => void;
}) {
  return (
    <AdminSectionCard
      title="背景與封面圖片"
      description="設定集合頁的主題顏色、按鈕顏色與頂部 Hero 主視覺圖片。"
    >
      <div className="flex gap-6">
        <ColorPickerField
          label="主題顏色"
          value={themeColor}
          presets={THEME_COLOR_PRESETS}
          onChange={onThemeColorChange}
        />
        <ColorPickerField
          label="按鈕顏色"
          value={buttonColor}
          presets={BUTTON_COLOR_PRESETS}
          onChange={onButtonColorChange}
        />
      </div>

      <HeroImageField fileName={heroImageName} />

      <AdminInfoNote>
        主題顏色會套用為 Hero 主視覺的深色遮罩與整體氛圍；若未上傳 Hero
        圖片，將直接以此顏色作為底色。按鈕顏色則套用於「查看更多」等主要按鈕與篩選標籤的選取狀態。
      </AdminInfoNote>
    </AdminSectionCard>
  );
}
