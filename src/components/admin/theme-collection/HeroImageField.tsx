export default function HeroImageField({ fileName }: { fileName: string }) {
  return (
    <div className="flex w-[964px] flex-col gap-2">
      <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">Hero 圖片</span>
      <div className="relative h-[260px] w-[964px] overflow-hidden rounded-[14px] bg-[#E0E3E8]">
        <div className="absolute inset-x-0 bottom-0 flex h-[52px] items-center justify-between bg-black/55 px-5">
          <span className="text-xs font-medium leading-[1.45em] text-white">{fileName}</span>
          <div className="flex items-center gap-3">
            <button type="button" className="cursor-pointer text-xs font-bold leading-[1.45em] text-white">
              更換圖片
            </button>
            <button type="button" className="cursor-pointer text-xs font-bold leading-[1.45em] text-white">
              移除
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs leading-[1.45em] text-[#535F71]">
        建議尺寸 1440×480px，檔案小於 5MB，支援 JPG／PNG／WebP
      </p>
    </div>
  );
}
