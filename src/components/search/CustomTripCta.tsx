export default function CustomTripCta() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] border border-[#E0E3E8] bg-gradient-to-r from-[#EDF5FF] to-[#FBF9F2] px-6 py-6 sm:flex-row sm:items-center sm:px-9">
      <div className="flex max-w-[760px] flex-col gap-2">
        <h2 className="font-serif text-2xl font-bold text-[#090909]">
          還沒找到理想行程？讓專屬顧問為您規劃。
        </h2>
        <p className="text-sm leading-relaxed text-[#535F71]">
          告訴我們期待的日期、預算與旅行方式，從路線、住宿到餐食，打造更貼近您的北海道旅程。
        </p>
      </div>
      <button
        type="button"
        className="flex h-11 w-full shrink-0 cursor-pointer items-center justify-center rounded-[11px] bg-[#0053E0] px-6 text-[13px] font-bold text-white sm:w-[168px]"
      >
        開始客製行程
      </button>
    </div>
  );
}
