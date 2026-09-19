export default function ServiceCta() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] border border-[#E0E3E8] bg-gradient-to-r from-[#EDF5FF] to-[#FBF9F2] px-6 py-6 sm:flex-row sm:items-center sm:px-9 sm:py-6">
      <div className="flex max-w-[652px] flex-col gap-2">
        <span className="text-[11px] font-semibold tracking-[0.1364em] text-[#0053E0]">SERVICE FIRST</span>
        <h2 className="font-serif text-xl font-bold text-[#090909] sm:text-2xl">
          準備好了嗎？由嘉新專員協助您確認團位與報名資料。
        </h2>
        <p className="text-[13px] leading-relaxed text-[#535F71]">
          自營行程不需要在線上獨自完成所有流程，您可以直接透過 LINE 或電話確認名額、訂金與需要準備的資料。
        </p>
      </div>
      <div className="flex w-full gap-2.5 sm:w-auto">
        <a
          href="tel:"
          className="flex h-[46px] flex-1 cursor-pointer items-center justify-center rounded-[11px] border border-[#C3C6D6] bg-white px-4 text-[13px] font-bold text-[#002366] transition hover:bg-slate-50 sm:flex-none sm:px-6"
        >
          電話諮詢
        </a>
        <a
          href="#"
          className="flex h-[46px] flex-1 cursor-pointer items-center justify-center rounded-[11px] bg-[#0053E0] px-4 text-[13px] font-bold text-white transition hover:bg-[#0044b8] sm:flex-none sm:px-6"
        >
          LINE 詢問行程
        </a>
      </div>
    </div>
  );
}
