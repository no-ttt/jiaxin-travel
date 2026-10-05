export default function AdminAddButton({
  label,
  onClick,
  disabled,
  title,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Tooltip, e.g. why the button is disabled. */
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded-lg bg-[#DBE8FF] text-sm font-bold leading-[1.5em] text-[#0053E0] transition hover:bg-[#B4BED1] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#DBE8FF]"
    >
      ＋ {label}
    </button>
  );
}
