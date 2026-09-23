"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChevronDownIcon from "./ChevronDownIcon";
import FilterDropdown from "./FilterDropdown";
import RowActionsMenu from "./RowActionsMenu";
import {
  FILTER_GROUPS,
  MOCK_TRIPS,
  TRIP_KIND_LABEL,
  TRIP_KIND_STYLE,
  TRIP_STATUS_LABEL,
  TRIP_STATUS_STYLE,
  type FilterGroupKey,
  type TripRow,
} from "./data";

const EMPTY_FILTERS: Record<FilterGroupKey, string[]> = {
  region: [],
  theme: [],
  zone: [],
  kind: [],
  status: [],
  days: [],
};

function matchesDaysRange(days: number, range: string) {
  if (range === "1-5") return days <= 5;
  if (range === "6-10") return days >= 6 && days <= 10;
  if (range === "11+") return days >= 11;
  return true;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

type SortKey = "days" | "priceValue" | "lastEditedMinutesAgo";
type SortDirection = "asc" | "desc";
type SortState = { key: SortKey; direction: SortDirection } | null;

export default function TripsTable() {
  const router = useRouter();
  const [allTrips, setAllTrips] = useState<TripRow[]>(MOCK_TRIPS);
  const [filters, setFilters] = useState<Record<FilterGroupKey, string[]>>(EMPTY_FILTERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1]);
  const [page, setPage] = useState(1);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);
  const [sort, setSort] = useState<SortState>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const duplicateTrip = (id: string) => {
    setAllTrips((prev) => {
      const source = prev.find((t) => t.id === id);
      if (!source) return prev;
      const index = prev.findIndex((t) => t.id === id);
      const copy: TripRow = {
        ...source,
        id: `${source.id}-copy-${Date.now()}`,
        name: `${source.name}（複製）`,
        status: "draft",
        lastEditedLabel: "剛剛",
        lastEditedMinutesAgo: 0,
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  const confirmDeleteTrip = () => {
    if (!pendingDeleteId) return;
    setAllTrips((prev) => prev.filter((t) => t.id !== pendingDeleteId));
    setSelectedIds((prev) => prev.filter((sid) => sid !== pendingDeleteId));
    setPendingDeleteId(null);
  };

  const toggleSort = (key: SortKey) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
    setPage(1);
  };

  useEffect(() => {
    if (!pageSizeOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (pageSizeRef.current && !pageSizeRef.current.contains(event.target as Node)) {
        setPageSizeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pageSizeOpen]);

  const setFilterGroup = (key: FilterGroupKey, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
    setPage(1);
  };

  const removeFilterValue = (key: FilterGroupKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key].filter((v) => v !== value) }));
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchTerm("");
    setPage(1);
  };

  const filteredTrips = useMemo(() => {
    return allTrips.filter((trip) => {
      if (searchTerm.trim() && !trip.name.toLowerCase().includes(searchTerm.trim().toLowerCase())) {
        return false;
      }
      if (filters.region.length && !filters.region.includes(trip.region)) return false;
      if (filters.theme.length && !trip.themes.some((t) => filters.theme.includes(t))) return false;
      if (filters.zone.length && !filters.zone.includes(trip.zone)) return false;
      if (filters.kind.length && !filters.kind.includes(trip.kind)) return false;
      if (filters.status.length && !filters.status.includes(trip.status)) return false;
      if (filters.days.length && !filters.days.some((range) => matchesDaysRange(trip.days, range))) {
        return false;
      }
      return true;
    });
  }, [allTrips, filters, searchTerm]);

  const sortedTrips = useMemo(() => {
    if (!sort) return filteredTrips;
    const { key, direction } = sort;
    const factor = direction === "asc" ? 1 : -1;
    return [...filteredTrips].sort((a, b) => (a[key] - b[key]) * factor);
  }, [filteredTrips, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedTrips.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const trips = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTrips.slice(start, start + pageSize);
  }, [sortedTrips, currentPage, pageSize]);

  const chips = useMemo(() => {
    return (Object.keys(filters) as FilterGroupKey[]).flatMap((key) =>
      filters[key].map((value) => {
        const group = FILTER_GROUPS[key];
        const option = group.options.find((o) => o.value === value);
        return {
          key,
          value,
          label: `已選：${option?.label ?? value}`,
        };
      })
    );
  }, [filters]);

  const allSelected = selectedIds.length > 0 && selectedIds.length === trips.length;

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : trips.map((t) => t.id));
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex w-full max-w-[1012px] flex-col gap-5">
      {/* Filter Bar */}
      <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#E0E3E8] bg-white p-4">
        <div className="flex w-full flex-wrap items-center gap-2.5">
          <div className="flex w-[240px] items-center gap-2 rounded-lg border border-[#E0E3E8] px-3 py-2 pr-3.5">
            <span className="text-[#535F71]">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="搜尋行程名稱"
              className="w-full text-[13px] leading-[1.45em] text-[#090909] placeholder:text-[#535F71] focus:outline-none"
            />
          </div>
          <FilterDropdown
            label={FILTER_GROUPS.region.label}
            options={FILTER_GROUPS.region.options}
            selected={filters.region}
            onChange={(values) => setFilterGroup("region", values)}
          />
          <FilterDropdown
            label={FILTER_GROUPS.theme.label}
            options={FILTER_GROUPS.theme.options}
            selected={filters.theme}
            onChange={(values) => setFilterGroup("theme", values)}
          />
          <FilterDropdown
            label={FILTER_GROUPS.zone.label}
            options={FILTER_GROUPS.zone.options}
            selected={filters.zone}
            onChange={(values) => setFilterGroup("zone", values)}
          />
          <FilterDropdown
            label={FILTER_GROUPS.kind.label}
            options={FILTER_GROUPS.kind.options}
            selected={filters.kind}
            onChange={(values) => setFilterGroup("kind", values)}
          />
          <FilterDropdown
            label={FILTER_GROUPS.status.label}
            options={FILTER_GROUPS.status.options}
            selected={filters.status}
            onChange={(values) => setFilterGroup("status", values)}
          />
          <FilterDropdown
            label={FILTER_GROUPS.days.label}
            options={FILTER_GROUPS.days.options}
            selected={filters.days}
            onChange={(values) => setFilterGroup("days", values)}
          />
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-auto cursor-pointer whitespace-nowrap text-[13px] font-bold leading-[1.45em] text-[#0053E0] hover:underline"
          >
            清除全部
          </button>
        </div>
      </div>

      {/* Chips + Result Summary */}
      <div className="flex w-full items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <div
              key={`${chip.key}-${chip.value}`}
              className="flex items-center gap-1.5 rounded-full bg-[#ECF1FA] py-1.5 pl-3 pr-2.5 text-xs font-medium leading-[1.45em] text-[#002366]"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={() => removeFilterValue(chip.key, chip.value)}
                className="cursor-pointer text-xs font-bold leading-none text-[#535F71] hover:text-[#090909]"
                aria-label={`移除 ${chip.label}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <p className="whitespace-nowrap text-sm font-medium leading-[1.45em] text-[#535F71]">
          符合條件：{filteredTrips.length} 筆行程
        </p>
        <div className="flex-1" />
        <button
          type="button"
          className="flex cursor-pointer items-center rounded-lg border border-[#E0E3E8] bg-white px-3.5 py-2 text-[13px] font-bold leading-[1.45em] text-[#0053E0] hover:bg-[#ECF1FA]"
        >
          預覽前台頁面
        </button>
      </div>

      {/* Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3 rounded-[10px] border border-[#0053E0] bg-[#ECF1FA] px-4 py-3">
            <p className="text-sm font-medium leading-[1.45em] text-[#002366]">
              已選取 {selectedIds.length} 筆
            </p>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="cursor-pointer text-sm font-medium leading-[1.45em] text-[#535F71] hover:text-[#090909]"
            >
              ✕ 清除選取
            </button>
            <div className="flex-1" />
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-[7px] border border-[#E0E3E8] bg-white px-3 py-1.5 text-[11px] font-bold leading-[1.45em] text-[#002366] hover:bg-[#ECF1FA]"
            >
              批次上架
            </button>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-[7px] border border-[#E0E3E8] bg-white px-3 py-1.5 text-[11px] font-bold leading-[1.45em] text-[#002366] hover:bg-[#ECF1FA]"
            >
              批次下架
            </button>
            <div className="h-6 w-px bg-[#E0E3E8]" />
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-[7px] border border-[#D98C8C] bg-white px-3 py-1.5 text-[11px] font-medium leading-[1.45em] text-[#C71A1A] hover:bg-[#FDEDED]"
            >
              刪除
            </button>
          </div>
          <p className="text-[11px] leading-[1.45em] text-[#535F71]">
            說明：此列平常隱藏，勾選任一列表項目後才滑出顯示；「刪除」點擊需二次確認彈窗。
          </p>
        </div>
      )}

      {/* Trip Table */}
      <div className="w-full overflow-hidden rounded-2xl border border-[#E0E3E8] bg-white">
        <div className="flex items-center gap-2.5 bg-[#FAFAFA] px-4 py-3">
          <div className="flex w-[22px] items-center justify-center">
            <button
              type="button"
              onClick={toggleAll}
              aria-pressed={allSelected}
              className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded-[5px] border text-[10px] font-bold leading-none text-white transition ${
                allSelected ? "border-[#0053E0] bg-[#0053E0]" : "border-[#E0E3E8] bg-white"
              }`}
            >
              {allSelected ? "✓" : ""}
            </button>
          </div>
          <div className="flex w-[360px] items-center">
            <span className="text-[12px] font-bold leading-[1.45em] text-[#535F71]">行程名稱</span>
          </div>
          <div className="flex w-[74px] items-center">
            <span className="text-[12px] font-bold leading-[1.45em] text-[#535F71]">類型</span>
          </div>
          <button
            type="button"
            onClick={() => toggleSort("days")}
            className="flex w-[66px] cursor-pointer items-center gap-0.5"
          >
            <span
              className={`text-[12px] font-bold leading-[1.45em] ${
                sort?.key === "days" ? "text-[#0053E0]" : "text-[#535F71]"
              }`}
            >
              天數
            </span>
            <span
              className={`text-[10px] font-bold ${
                sort?.key === "days" ? "text-[#0053E0]" : "text-[#535F71]"
              }`}
            >
              {sort?.key === "days" ? (sort.direction === "asc" ? "▲" : "▼") : "↕"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => toggleSort("priceValue")}
            className="flex w-[104px] cursor-pointer items-center gap-0.5"
          >
            <span
              className={`text-[12px] font-bold leading-[1.45em] ${
                sort?.key === "priceValue" ? "text-[#0053E0]" : "text-[#535F71]"
              }`}
            >
              起價
            </span>
            <span
              className={`text-[10px] font-bold ${
                sort?.key === "priceValue" ? "text-[#0053E0]" : "text-[#535F71]"
              }`}
            >
              {sort?.key === "priceValue" ? (sort.direction === "asc" ? "▲" : "▼") : "↕"}
            </span>
          </button>
          <div className="flex w-[62px] items-center">
            <span className="text-[12px] font-bold leading-[1.45em] text-[#535F71]">狀態</span>
          </div>
          <button
            type="button"
            onClick={() => toggleSort("lastEditedMinutesAgo")}
            className="flex w-[66px] cursor-pointer items-center gap-1"
          >
            <span
              className={`text-[12px] font-bold leading-[1.45em] ${
                sort?.key === "lastEditedMinutesAgo" ? "text-[#0053E0]" : "text-[#535F71]"
              }`}
            >
              最後編輯
            </span>
            <span
              className={`text-[10px] font-bold ${
                sort?.key === "lastEditedMinutesAgo" ? "text-[#0053E0]" : "text-[#535F71]"
              }`}
            >
              {sort?.key === "lastEditedMinutesAgo" ? (sort.direction === "asc" ? "▲" : "▼") : "↕"}
            </span>
          </button>
          <div className="flex w-[58px] items-center">
            <span className="text-[12px] font-bold leading-[1.45em] text-[#535F71]">操作</span>
          </div>
        </div>

        {trips.length === 0 && (
          <div className="flex items-center justify-center border-t border-[#E0E3E8] px-4 py-10">
            <span className="text-sm font-medium leading-[1.45em] text-[#535F71]">
              沒有符合條件的行程
            </span>
          </div>
        )}

        {trips.map((trip) => {
          const checked = selectedIds.includes(trip.id);
          return (
            <div
              key={trip.id}
              onDoubleClick={() => router.push(`/admin/dashboard/trips/${trip.id}`)}
              className="flex cursor-pointer items-center gap-2.5 border-t border-[#E0E3E8] px-4 py-2.5 hover:bg-[#FAFAFA]"
            >
              <div
                className="flex w-[22px] items-center justify-center"
                onDoubleClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => toggleRow(trip.id)}
                  aria-pressed={checked}
                  className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded-[5px] border text-[10px] font-bold leading-none text-white transition ${
                    checked ? "border-[#0053E0] bg-[#0053E0]" : "border-[#E0E3E8] bg-white"
                  }`}
                >
                  {checked ? "✓" : ""}
                </button>
              </div>
              <div className="flex w-[360px] items-center">
                <span className="text-sm font-medium leading-[1.45em] text-[#002366]">
                  {trip.name}
                </span>
              </div>
              <div className="flex w-[74px] items-center">
                <span
                  className={`rounded-md px-2 py-1 text-[11px] font-bold leading-[1.45em] ${TRIP_KIND_STYLE[trip.kind]}`}
                >
                  {TRIP_KIND_LABEL[trip.kind]}
                </span>
              </div>
              <div className="flex w-[66px] items-center">
                <span className="text-xs font-medium leading-[1.45em] text-[#535F71]">
                  {trip.duration}
                </span>
              </div>
              <div className="flex w-[104px] items-center">
                <span className="text-[12px] font-bold leading-[1.45em] text-[#002366]">
                  {trip.priceFrom}
                </span>
              </div>
              <div className="flex w-[62px] items-center">
                <span
                  className={`rounded-md px-2 py-1 text-[11px] font-bold leading-[1.45em] ${TRIP_STATUS_STYLE[trip.status]}`}
                >
                  {TRIP_STATUS_LABEL[trip.status]}
                </span>
              </div>
              <div className="flex w-[66px] items-center">
                <span className="text-xs font-medium leading-[1.45em] text-[#535F71]">
                  {trip.lastEditedLabel}
                </span>
              </div>
              <div
                className="flex w-[58px] items-center gap-1.5"
                onDoubleClick={(e) => e.stopPropagation()}
              >
                <RowActionsMenu
                  onDuplicate={() => duplicateTrip(trip.id)}
                  onDelete={() => setPendingDeleteId(trip.id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex w-full items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium leading-[1.45em] text-[#535F71]">每頁顯示</span>
          <div ref={pageSizeRef} className="relative">
            <button
              type="button"
              onClick={() => setPageSizeOpen((prev) => !prev)}
              className="flex cursor-pointer items-center gap-1.5 rounded-[7px] border border-[#E0E3E8] px-2.5 py-1.5 text-[13px] font-bold leading-[1.45em] text-[#002366] hover:border-[#0053E0]"
            >
              {pageSize}
              <ChevronDownIcon />
            </button>
            {pageSizeOpen && (
              <div className="absolute bottom-[calc(100%+6px)] left-0 z-20 flex w-[80px] flex-col gap-0.5 rounded-xl border border-[#E0E3E8] bg-white p-1.5 shadow-lg">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setPageSize(size);
                      setPage(1);
                      setPageSizeOpen(false);
                    }}
                    className={`cursor-pointer rounded-lg px-2 py-1.5 text-left text-[13px] leading-[1.45em] hover:bg-[#ECF1FA] ${
                      size === pageSize ? "font-bold text-[#0053E0]" : "text-[#090909]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-sm font-medium leading-[1.45em] text-[#535F71]">筆／頁</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="上一頁"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[7px] border border-[#E0E3E8] bg-white text-[#535F71] hover:border-[#0053E0] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E0E3E8]"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setPage(pageNum)}
              className={`flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[7px] text-xs font-bold leading-[1.45em] ${
                pageNum === currentPage
                  ? "bg-[#0053E0] text-white"
                  : "border border-[#E0E3E8] bg-white text-[#002366] hover:border-[#0053E0]"
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            type="button"
            aria-label="下一頁"
            disabled={currentPage >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[7px] border border-[#E0E3E8] bg-white text-[#535F71] hover:border-[#0053E0] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E0E3E8]"
          >
            ›
          </button>
        </div>
      </div>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="flex w-full max-w-[360px] flex-col gap-4 rounded-2xl bg-white p-6">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-base font-bold leading-[1.45em] text-[#090909]">刪除行程</h2>
              <p className="text-sm font-medium leading-[1.45em] text-[#535F71]">
                確定要刪除「{allTrips.find((t) => t.id === pendingDeleteId)?.name}」嗎？
              </p>
            </div>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="flex h-10 cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] bg-white px-4 text-sm font-bold leading-[1.45em] text-[#090909] hover:bg-[#F6F6F6]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmDeleteTrip}
                className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-[#C71A1A] px-4 text-sm font-bold leading-[1.45em] text-white hover:bg-[#A81515]"
              >
                確定刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
