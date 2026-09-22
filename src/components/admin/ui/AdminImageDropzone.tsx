type AdminImageDropzoneProps = {
  fieldLabel?: string;
  label: string;
  hint?: string;
  size?: "sm" | "lg";
  hintPosition?: "below" | "beside";
};

export default function AdminImageDropzone({
  fieldLabel,
  label,
  hint = "支援 JPG / PNG",
  size = "lg",
  hintPosition = "below",
}: AdminImageDropzoneProps) {
  const boxClass = size === "sm" ? "h-[88px] w-[88px]" : "h-[116px] w-[288px]";

  const dropzone = (
    <button
      type="button"
      className={`flex ${boxClass} cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[#E0E3E8] bg-[#FAFAFA] px-4 py-[22px] transition hover:border-[#0053E0]`}
    >
      <span className="text-[22px] leading-[1.45em] text-[#0053E0]">＋</span>
      <span className="text-[13px] font-medium leading-[1.45em] text-[#0053E0]">{label}</span>
    </button>
  );

  if (hintPosition === "beside") {
    return (
      <div className="flex flex-col gap-2">
        {fieldLabel && <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">{fieldLabel}</span>}
        <div className="flex items-end gap-2">
          {dropzone}
          <span className="text-xs leading-[1.45em] text-[#535F71]">{hint}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {fieldLabel && <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">{fieldLabel}</span>}
      {dropzone}
      <span className="text-xs leading-[1.45em] text-[#535F71]">{hint}</span>
    </div>
  );
}
