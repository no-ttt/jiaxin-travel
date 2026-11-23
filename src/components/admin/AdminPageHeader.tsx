type AdminPageHeaderProps = {
  title: string;
  description: string;
  onPreview?: () => void;
  onSave?: () => void;
  saveDisabled?: boolean;
};

export default function AdminPageHeader({
  title,
  description,
  onPreview,
  onSave,
  saveDisabled = false,
}: AdminPageHeaderProps) {
  // Stays pinned while scrolling so 儲存變更 is always reachable (bg hides the content scrolling under it).
  return (
    <div className="sticky top-0 z-30 -mb-4 -mt-6 flex items-center justify-between bg-[#FAFAFA] pb-4 pt-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold leading-[1.45em] text-[#090909]">{title}</h1>
        <p className="text-sm font-medium leading-[1.45em] text-[#535F71]">{description}</p>
      </div>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onPreview}
          className="flex h-10 w-[92px] cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] bg-white text-sm font-bold leading-[1.45em] text-[#090909] transition hover:bg-[#F6F6F6]"
        >
          預覽
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saveDisabled}
          className="flex h-10 w-[126px] cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] text-sm font-bold leading-[1.45em] text-white transition hover:bg-[#0047BE] disabled:cursor-not-allowed disabled:bg-[#B4BED1] disabled:hover:bg-[#B4BED1]"
        >
          儲存變更
        </button>
      </div>
    </div>
  );
}
