/** Small bordered row action (複製／上移／刪除…) used on editor cards. */
export default function RowActionButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#E0E3E8] bg-white px-3 py-2 text-[13px] font-medium leading-[1.45em] text-[#535F71] hover:border-[#0053E0] hover:bg-[#ECF1FA] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E0E3E8] disabled:hover:bg-white"
    >
      {label}
    </button>
  );
}
