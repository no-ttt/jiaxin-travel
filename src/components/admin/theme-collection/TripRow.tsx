import type { DragEvent } from "react";
import type { ThemeCollectionTrip } from "./data";

export default function TripRow({
  trip,
  order,
  canMoveUp,
  onMoveUp,
  onRemove,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: {
  trip: ThemeCollectionTrip;
  order: number;
  canMoveUp: boolean;
  onMoveUp: () => void;
  onRemove: () => void;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`flex w-[964px] items-center gap-4 rounded-xl border bg-white p-3 transition ${
        isDragOver ? "border-[#0053E0] bg-[#ECF1FA]" : "border-[#E0E3E8]"
      } ${isDragging ? "opacity-40" : ""}`}
    >
      <span className="shrink-0 cursor-grab select-none text-base leading-[1.45em] text-[#535F71] active:cursor-grabbing" aria-hidden>
        ⠿
      </span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#002366] text-[13px] font-bold leading-[1.45em] text-white">
        {order}
      </span>
      <div className="h-14 w-14 shrink-0 rounded-[10px] bg-[#E0E3E8]" />
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-bold leading-[1.45em] text-[#090909]">{trip.title}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs leading-[1.45em] text-[#535F71]">{trip.code}</span>
          <span className="text-xs leading-[1.45em] text-[#E0E3E8]">｜</span>
          <span className="text-[13px] font-medium leading-[1.45em] text-[#0053E0]">{trip.priceFrom}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#E0E3E8] bg-white px-3 py-2 text-[13px] font-medium leading-[1.45em] text-[#535F71] transition hover:border-[#0053E0] hover:bg-[#ECF1FA] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E0E3E8] disabled:hover:bg-white"
        >
          上移
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#E0E3E8] bg-white px-3 py-2 text-[13px] font-medium leading-[1.45em] text-[#535F71] transition hover:border-[#0053E0] hover:bg-[#ECF1FA]"
        >
          移除
        </button>
      </div>
    </div>
  );
}
