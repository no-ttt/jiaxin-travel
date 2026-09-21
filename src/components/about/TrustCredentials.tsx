const CREDENTIALS = [
  {
    title: "合法授權",
    description: "政府合法授權認證（交觀綜／甲字編號）",
  },
  {
    title: "品質保障",
    description: "中華民國旅行業品質保障協會（品保會員編號）",
  },
  {
    title: "長期信任",
    description: "歷年旅遊獎項、媒體報導與異業合作紀錄",
  },
];

export default function TrustCredentials() {
  return (
    <section className="flex flex-col items-center gap-10 bg-[#F6F6F6] px-4 py-14 sm:px-8 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-[120px] lg:py-20">
      <div className="relative w-full max-w-[420px] pb-6 pl-6">
        <div className="absolute bottom-0 left-0 h-[167px] w-[384px] rounded-3xl bg-[#DBE8FF]" />
        <div className="relative flex h-[167px] w-full max-w-[384px] flex-col justify-center gap-3 rounded-3xl bg-white px-8 py-6 shadow-[0px_16px_36px_0px_rgba(5,15,31,0.1)]">
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" className="text-[#0053E0]">
            <path
              d="M0 18V10.667C0 4.267 4 0.4 10.667 0L11.333 2.667C7.333 3.733 5.333 6 5.333 9.333H10.667V18H0ZM13.333 18V10.667C13.333 4.267 17.333 0.4 24 0L24.667 2.667C20.667 3.733 18.667 6 18.667 9.333H24V18H13.333Z"
              fill="currentColor"
            />
          </svg>
          <p className="font-serif text-2xl font-bold leading-[1.55] text-[#090909]">
            安心，是看得見的承諾。
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-[588px] flex-col">
        {CREDENTIALS.map((credential, i) => (
          <div key={credential.title}>
            {i > 0 && <div className="h-px w-full bg-[#E0E3E8]" />}
            <div className="flex items-center gap-4 py-6 sm:gap-[18px]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DBE8FF] text-base font-semibold text-[#0053E0]">
                ✓
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-medium leading-[1.45] text-[#090909] sm:text-[17px]">
                  {credential.title}
                </h3>
                <p className="text-sm leading-[1.55] text-[#535F71]">
                  {credential.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
