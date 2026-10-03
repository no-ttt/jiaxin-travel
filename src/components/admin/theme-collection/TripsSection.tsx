"use client";

import { useEffect, useState } from "react";
import { useCollectionTripSearch } from "@/lib/api/hooks/useCollections";
import type { CollectionTrip } from "@/lib/api/types/collection";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import TripRow, { TripPrice, TripThumbnail } from "./TripRow";

const SEARCH_DEBOUNCE_MS = 300;

export default function TripsSection({
  collectionId,
  trips,
  onTripsChange,
}: {
  collectionId: number;
  trips: CollectionTrip[];
  onTripsChange: (trips: CollectionTrip[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const search = useCollectionTripSearch(collectionId, debouncedQuery);
  const addedIds = new Set(trips.map((trip) => trip.id));
  const results = (search.data ?? []).filter((trip) => !addedIds.has(trip.id));
  const isSearching = query.trim() !== "" && (query !== debouncedQuery || search.isFetching);

  const addTrip = (trip: CollectionTrip) => {
    onTripsChange([...trips, trip]);
    setQuery("");
  };

  const removeTrip = (id: string) => {
    onTripsChange(trips.filter((trip) => trip.id !== id));
  };

  const moveTrip = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= trips.length) return;
    const next = [...trips];
    [next[index], next[target]] = [next[target], next[index]];
    onTripsChange(next);
  };

  const handleDrop = (targetIndex: number, sourceIndex: number) => {
    if (sourceIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...trips];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    onTripsChange(next);
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <AdminSectionCard title="加入行程" description="透過團號或團名搜尋行程，加入此主題集合頁。">
      <div className="flex flex-col gap-[7px]">
        <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">
          搜尋並加入行程（可輸入團號或團名）
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="輸入團號或團名搜尋"
          className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
        />
      </div>

      {query.trim() !== "" && results.length === 0 && (
        <p className="text-[13px] leading-[1.45em] text-[#535F71]">
          {isSearching ? "搜尋中…" : search.isError ? "搜尋失敗，請稍後再試" : "查無符合的已上架行程"}
        </p>
      )}

      {results.length > 0 && (
        <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#E0E3E8] bg-white shadow-[0px_6px_16px_0px_rgba(0,0,0,0.08)]">
          {results.map((trip) => (
            <div key={trip.id} className="flex w-full items-center gap-3 px-4 py-3">
              <TripThumbnail url={trip.thumbnail} className="h-11 w-11 rounded-lg" />
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm font-bold leading-[1.45em] text-[#090909]">{trip.product_name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs leading-[1.45em] text-[#535F71]">{trip.trip_code}</span>
                  <span className="text-xs leading-[1.45em] text-[#E0E3E8]">｜</span>
                  <TripPrice trip={trip} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => addTrip(trip)}
                className="flex h-[35px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#E0E3E8] bg-white px-4 text-[13px] font-bold leading-[1.45em] text-[#0053E0] transition hover:bg-[#ECF1FA]"
              >
                ＋ 加入
              </button>
            </div>
          ))}
        </div>
      )}

      <span className="text-base font-bold leading-[1.45em] text-[#090909]">已加入的行程（{trips.length}）</span>

      <div className="flex flex-col gap-3">
        {trips.map((trip, index) => (
          <TripRow
            key={trip.id}
            trip={trip}
            order={index + 1}
            canMoveUp={index > 0}
            onMoveUp={() => moveTrip(index, -1)}
            onRemove={() => removeTrip(trip.id)}
            isDragging={dragIndex === index}
            isDragOver={overIndex === index && dragIndex !== index}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", String(index));
              e.dataTransfer.effectAllowed = "move";
              setDragIndex(index);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setOverIndex(index);
            }}
            onDragLeave={() => setOverIndex((current) => (current === index ? null : current))}
            onDrop={(e) => {
              e.preventDefault();
              const sourceIndex = Number(e.dataTransfer.getData("text/plain"));
              handleDrop(index, sourceIndex);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
          />
        ))}
      </div>

      <AdminInfoNote>
        已加入的行程將依序顯示於集合頁的行程列表中；建議 6–12 筆效果最佳，超過將以「查看更多」分頁載入。
      </AdminInfoNote>
    </AdminSectionCard>
  );
}
