export default function ToggleSwitch({
  checked,
  onChange,
  label,
  size = "md",
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
  size?: "sm" | "md";
}) {
  const dimensions = size === "sm" ? "h-6 w-10" : "h-6 w-[42px]";
  const knobOffset = size === "sm" ? (checked ? "left-[18px]" : "left-0.5") : checked ? "left-[19px]" : "left-0.5";

  return (
    <button
      type="button"
      onClick={onChange}
      aria-label={label}
      aria-pressed={checked}
      className={`relative ${dimensions} shrink-0 cursor-pointer rounded-xl transition ${
        checked ? "bg-[#0053E0]" : "bg-[#E0E3E8]"
      }`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${knobOffset}`} />
    </button>
  );
}
