"use client";

type AdminConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  /** Pass null to show only the confirm button (e.g. a required action). */
  cancelLabel?: string | null;
  onConfirm: () => void;
  onCancel?: () => void;
};

/** Confirmation modal, styled after the trip list's delete confirmation. */
export default function AdminConfirmDialog({
  title,
  message,
  confirmLabel = "確定",
  cancelLabel = "取消",
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        className="flex w-full max-w-[360px] flex-col gap-4 rounded-2xl bg-white p-6"
      >
        <div className="flex flex-col gap-1.5">
          <h2 id="admin-confirm-title" className="text-base font-bold leading-[1.45em] text-[#090909]">
            {title}
          </h2>
          <p className="text-sm font-medium leading-[1.45em] text-[#535F71]">{message}</p>
        </div>
        <div className="flex justify-end gap-2.5">
          {cancelLabel !== null && (
            <button
              type="button"
              onClick={onCancel}
              className="flex h-10 cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] bg-white px-4 text-sm font-bold leading-[1.45em] text-[#090909] hover:bg-[#F6F6F6]"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] px-4 text-sm font-bold leading-[1.45em] text-white hover:bg-[#0047BE]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
