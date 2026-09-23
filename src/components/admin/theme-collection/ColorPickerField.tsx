export default function ColorPickerField({
  label,
  value,
  presets,
  onChange,
}: {
  label: string;
  value: string;
  presets: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex w-[470px] flex-col gap-2">
      <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">{label}</span>
      <div className="flex h-11 w-[470px] items-center gap-3">
        <span
          className="h-11 w-11 shrink-0 rounded-xl border border-[#E0E3E8]"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-[414px] rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
        />
      </div>
      <p className="text-xs leading-[1.45em] text-[#535F71]">點擊色塊選擇顏色，或直接輸入 Hex 色碼</p>
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
