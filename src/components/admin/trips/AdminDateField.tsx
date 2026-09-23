"use client";

type AdminDateFieldProps = {
  value: string;
  onChange: (value: string) => void;
  size?: "default" | "compact";
};

export default function AdminDateField({ value, onChange, size = "default" }: AdminDateFieldProps) {
  const sizeClass =
    size === "compact"
      ? "h-9 rounded-lg px-2 text-sm"
      : "h-11 rounded-xl px-4 text-[15px]";

  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full min-w-0 cursor-pointer border border-[#E0E3E8] bg-[#FAFAFA] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0] ${sizeClass}`}
    />
  );
}
