import { isValidColor } from "./data";

export default function ColorPickerField({
  label,
  value,
  presets,
  defaultColor,
  onChange,
}: {
  label: string;
  /** Blank = not set; the public page then uses `defaultColor`. */
  value: string;
  presets: string[];
  defaultColor: string;
  onChange: (value: string) => void;
}) {
  const valid = isValidColor(value);
  const swatch = value.trim() === "" ? defaultColor : value;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">{label}</span>
      <div className="flex h-11 w-full items-center gap-3">
        <label
          className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-[#E0E3E8]"
          style={{ backgroundColor: valid ? swatch : defaultColor }}
        >
          <input
            type="color"
            value={valid ? swatch : defaultColor}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={`選擇${label}`}
          />
        </label>
        <input
          type="text"
          value={value}
          placeholder={`未設定（預設 ${defaultColor}）`}
          onChange={(e) => onChange(e.target.value)}
          className={`h-11 min-w-0 flex-1 rounded-xl border bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0] ${
            valid ? "border-[#E0E3E8]" : "border-[#D92D20]"
          }`}
        />
      </div>
      {valid ? (
        <p className="text-xs leading-[1.45em] text-[#535F71]">點擊色塊選擇顏色，或直接輸入 Hex 色碼</p>
      ) : (
        <p className="text-xs leading-[1.45em] text-[#D92D20]">請輸入 #RRGGBB 格式的色碼（例如 #14111A），或清空使用預設色</p>
      )}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold leading-[1.45em] text-[#535F71]">快速套用</span>
        <div className="flex h-7 items-center gap-2.5">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              aria-label={`套用色彩 ${preset}`}
              className={`h-7 w-7 shrink-0 cursor-pointer rounded-full border transition ${
                preset.toLowerCase() === value.toLowerCase()
                  ? "border-2 border-[#0053E0]"
                  : "border border-[#E0E3E8]"
              }`}
              style={{ backgroundColor: preset }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
