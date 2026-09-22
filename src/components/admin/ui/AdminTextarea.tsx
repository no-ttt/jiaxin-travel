type AdminTextareaProps = {
  label: string;
  value?: string;
  defaultValue?: string;
  rows?: number;
  onChange?: (value: string) => void;
};

export default function AdminTextarea({ label, value, defaultValue, rows = 3, onChange }: AdminTextareaProps) {
  return (
    <div className="flex flex-col gap-[7px]">
      <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">{label}</span>
      <textarea
        value={value}
        defaultValue={defaultValue}
        rows={rows}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full resize-none rounded-lg border border-[#E0E3E8] bg-white px-3.5 py-[11px] text-sm font-medium leading-[1.5em] text-[#090909] outline-none focus:border-[#0053E0]"
      />
    </div>
  );
}
