type AdminTextInputProps = {
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export default function AdminTextInput({ label, value, defaultValue, placeholder, onChange }: AdminTextInputProps) {
  return (
    <div className="flex flex-col gap-[7px]">
      <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">{label}</span>
      <input
        type="text"
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
      />
    </div>
  );
}
