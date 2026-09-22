type RowAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type AdminRowActionsProps = {
  actions: RowAction[];
};

export default function AdminRowActions({ actions }: AdminRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#E0E3E8] bg-white px-3 py-2 text-[13px] font-medium leading-[1.45em] text-[#535F71] transition hover:border-[#0053E0] hover:bg-[#ECF1FA] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E0E3E8] disabled:hover:bg-white"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
