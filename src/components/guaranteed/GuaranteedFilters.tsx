"use client";

import Dropdown from "@/components/ui/Dropdown";

export type SortOption = "依出發日期" | "價格由低到高" | "價格由高到低";

export type GuaranteedFilterState = {
  destination: string;
  departureMonth: string;
  duration: string;
  sort: SortOption;
};

const DESTINATION_OPTIONS = ["全部地區", "北海道", "京都", "九州", "富士山", "瀨戶內海", "沖繩"];
const MONTH_OPTIONS = ["全部月份", "9 月", "10 月", "11 月", "12 月"];
const DURATION_OPTIONS = ["不限", "4-5 天", "6-7 天", "8 天以上"];
const SORT_OPTIONS: SortOption[] = ["依出發日期", "價格由低到高", "價格由高到低"];

export default function GuaranteedFilters({
  filters,
  onChange,
}: {
  filters: GuaranteedFilterState;
  onChange: (filters: GuaranteedFilterState) => void;
}) {
  return (
    <div className="flex w-full flex-wrap items-center gap-3 rounded-2xl bg-[#FAFAFA] px-4 py-5 sm:px-6">
      <div className="min-w-[180px] flex-1">
        <FilterField label="目的地">
          <Dropdown
            placeholder="全部地區"
            options={DESTINATION_OPTIONS}
            value={filters.destination}
            onChange={(value) => onChange({ ...filters, destination: value })}
          />
        </FilterField>
      </div>
      <div className="min-w-[180px] flex-1">
        <FilterField label="出發月份">
          <Dropdown
            placeholder="全部月份"
            options={MONTH_OPTIONS}
            value={filters.departureMonth}
            onChange={(value) => onChange({ ...filters, departureMonth: value })}
          />
        </FilterField>
      </div>
      <div className="min-w-[180px] flex-1">
        <FilterField label="旅遊天數">
          <Dropdown
            placeholder="不限"
            options={DURATION_OPTIONS}
            value={filters.duration}
            onChange={(value) => onChange({ ...filters, duration: value })}
          />
        </FilterField>
      </div>
      <div className="min-w-[180px] flex-1">
        <FilterField label="排序">
          <Dropdown
            placeholder="依出發日期"
            options={SORT_OPTIONS}
            value={filters.sort}
            onChange={(value) => onChange({ ...filters, sort: value as SortOption })}
          />
        </FilterField>
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex h-[52px] items-center gap-2 rounded-xl border border-[#E0E3E8] bg-white px-3.5">
      <span className="shrink-0 text-xs text-[#535F71]">{label}</span>
      <div className="min-w-0 flex-1 [&_button]:h-auto [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-0 [&_button]:text-sm [&_button]:font-medium">
        {children}
      </div>
    </div>
  );
}
