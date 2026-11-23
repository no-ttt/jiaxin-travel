"use client";

import Dropdown from "@/components/ui/Dropdown";

export type SortOption = "依出發日期" | "價格由低到高" | "價格由高到低";

export type GuaranteedFilterState = {
  destination: string;
  departureMonth: string;
  duration: string;
  sort: SortOption;
};

export const ALL_DESTINATIONS = "全部地區";
export const ALL_MONTHS = "全部月份";
const MONTH_OPTIONS = [ALL_MONTHS, ...Array.from({ length: 12 }, (_, i) => `${i + 1} 月`)];
const DURATION_OPTIONS = ["不限", "1-5 天", "6-10 天", "11-15 天", "15 天以上"];
const SORT_OPTIONS: SortOption[] = ["依出發日期", "價格由低到高", "價格由高到低"];

export default function GuaranteedFilters({
  filters,
  regionNames,
  onChange,
}: {
  filters: GuaranteedFilterState;
  /** 產品分類設定 region names (navigation API). */
  regionNames: string[];
  onChange: (filters: GuaranteedFilterState) => void;
}) {
  return (
    <div className="flex w-full flex-wrap items-center gap-3 rounded-2xl bg-[#FAFAFA] p-4">
      <div className="min-w-[180px] flex-1 lg:w-[270px] lg:flex-none">
        <Dropdown
          label="目的地"
          placeholder="全部地區"
          options={[ALL_DESTINATIONS, ...regionNames]}
          value={filters.destination}
          onChange={(value) => onChange({ ...filters, destination: value })}
        />
      </div>
      <div className="min-w-[180px] flex-1 lg:w-[270px] lg:flex-none">
        <Dropdown
          label="出發月份"
          placeholder="全部月份"
          options={MONTH_OPTIONS}
          value={filters.departureMonth}
          onChange={(value) => onChange({ ...filters, departureMonth: value })}
        />
      </div>
      <div className="min-w-[180px] flex-1 lg:w-[270px] lg:flex-none">
        <Dropdown
          label="旅遊天數"
          placeholder="不限"
          options={DURATION_OPTIONS}
          value={filters.duration}
          onChange={(value) => onChange({ ...filters, duration: value })}
        />
      </div>
      <div className="min-w-[180px] flex-1 lg:w-[270px] lg:flex-none">
        <Dropdown
          label="排序"
          placeholder="依出發日期"
          options={SORT_OPTIONS}
          value={filters.sort}
          onChange={(value) => onChange({ ...filters, sort: value as SortOption })}
        />
      </div>
    </div>
  );
}
