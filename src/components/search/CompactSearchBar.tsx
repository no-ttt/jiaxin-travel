import Image from "next/image";

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-[11px] font-medium tracking-wide text-[#475569]">{label}</span>
      <div className="flex h-[42px] items-center gap-2 rounded-[10px] border border-[#E0E3E8] bg-[#FAFAFA] px-[13px]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#090909] outline-none placeholder:text-[#535F71]"
        />
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-[11px] font-medium tracking-wide text-[#475569]">{label}</span>
      <div className="flex h-[42px] items-center gap-2 rounded-[10px] border border-[#E0E3E8] bg-[#FAFAFA] px-[13px]">
        <Image src="/images/calendar-icon.svg" alt="" width={18} height={18} className="shrink-0" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#090909] outline-none [color-scheme:light]"
        />
      </div>
    </div>
  );
}

export type SearchQuery = {
  destination: string;
  keyword: string;
  startDate: string;
  endDate: string;
};

export default function CompactSearchBar({
  query,
  onChange,
  onSearch,
}: {
  query: SearchQuery;
  onChange: (query: SearchQuery) => void;
  onSearch: () => void;
}) {
  return (
    <div className="relative z-10 mx-4 flex flex-col items-stretch gap-3 rounded-[20px] border border-[#DBE3ED]/95 bg-white p-4 shadow-[0px_10px_28px_-8px_rgba(5,20,41,0.08)] sm:mx-8 sm:flex-row sm:items-end sm:gap-3 sm:p-[17px_48px] lg:mx-[120px]">
      <TextField
        label="目的地"
        value={query.destination}
        onChange={(destination) => onChange({ ...query, destination })}
      />
      <TextField
        label="關鍵字"
        value={query.keyword}
        onChange={(keyword) => onChange({ ...query, keyword })}
      />
      <DateField
        label="出發日期"
        value={query.startDate}
        onChange={(startDate) => onChange({ ...query, startDate })}
      />
      <DateField
        label="結束日期"
        value={query.endDate}
        onChange={(endDate) => onChange({ ...query, endDate })}
      />
      <button
        type="button"
        onClick={onSearch}
        className="flex h-[42px] w-full shrink-0 cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#0053E0] px-6 text-base font-bold uppercase text-white transition hover:bg-[#0044b8] sm:w-[200px]"
      >
        <Image src="/images/search-icon.svg" alt="" width={24} height={24} />
        搜尋行程
      </button>
    </div>
  );
}
