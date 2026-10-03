import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import ColorPickerField from "./ColorPickerField";
import HeroImageField from "./HeroImageField";
import {
  BUTTON_COLOR_PRESETS,
  DEFAULT_BUTTON_COLOR,
  DEFAULT_THEME_COLOR,
  THEME_COLOR_PRESETS,
  isValidColor,
} from "./data";

export default function BackgroundCoverSection({
  themeColor,
  buttonColor,
  heroMediaId,
  onThemeColorChange,
  onButtonColorChange,
  onHeroMediaChange,
}: {
  themeColor: string;
  buttonColor: string;
  heroMediaId: string | null;
  onThemeColorChange: (value: string) => void;
  onButtonColorChange: (value: string) => void;
  onHeroMediaChange: (mediaId: string | null) => void;
}) {
  const heroBackground = themeColor.trim() && isValidColor(themeColor) ? themeColor : DEFAULT_THEME_COLOR;
  return (
    <AdminSectionCard
      title="背景與封面圖片"
      description="設定集合頁的主題顏色、按鈕顏色與頂部 Hero 主視覺圖片。"
    >
      <div className="grid grid-cols-2 gap-6">
        <ColorPickerField
          label="主題顏色"
          value={themeColor}
          presets={THEME_COLOR_PRESETS}
          defaultColor={DEFAULT_THEME_COLOR}
          onChange={onThemeColorChange}
        />
        <ColorPickerField
          label="按鈕顏色"
          value={buttonColor}
          presets={BUTTON_COLOR_PRESETS}
          defaultColor={DEFAULT_BUTTON_COLOR}
          onChange={onButtonColorChange}
        />
      </div>

      <HeroImageField mediaId={heroMediaId} fallbackColor={heroBackground} onChange={onHeroMediaChange} />

      <AdminInfoNote>
        主題顏色會套用為 Hero 主視覺的深色遮罩與整體氛圍；若未上傳 Hero
        圖片，將直接以此顏色作為底色。按鈕顏色則套用於「查看更多」等主要按鈕與首圖標籤。顏色留空時使用預設色。
      </AdminInfoNote>
    </AdminSectionCard>
  );
}
