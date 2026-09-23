"use client";

import { useMemo, useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import TripRow from "./TripRow";
import { SEARCHABLE_TRIPS, type ThemeCollectionTrip } from "./data";

export default function TripsSection({
  trips,
  onTripsChange,
}: {
  trips: ThemeCollectionTrip[];
  onTripsChange: (trips: ThemeCollectionTrip[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const addedIds = new Set(trips.map((trip) => trip.id));
    return SEARCHABLE_TRIPS.filter(
      (trip) =>
        !addedIds.has(trip.id) &&
        (trip.title.includes(query) || trip.code.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, trips]);

  const addTrip = (trip: ThemeCollectionTrip) => {
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
          className="h-11 w-[964px] rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
        />
      </div>

      {results.length > 0 && (
        <div className="flex w-[964px] flex-col overflow-hidden rounded-xl border border-[#E0E3E8] bg-white shadow-[0px_6px_16px_0px_rgba(0,0,0,0.08)]">
          {results.map((trip) => (
            <div key={trip.id} className="flex w-[964px] items-center gap-3 px-4 py-3">
              <div className="h-11 w-11 shrink-0 rounded-lg bg-[#E0E3E8]" />
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm font-bold leading-[1.45em] text-[#090909]">{trip.title}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs leading-[1.45em] text-[#535F71]">{trip.code}</span>
                  <span className="text-xs leading-[1.45em] text-[#E0E3E8]">｜</span>
                  <span className="text-[13px] font-medium leading-[1.45em] text-[#0053E0]">
                    {trip.priceFrom}
                  </span>
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
