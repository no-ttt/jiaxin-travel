"use client";

import Image from "next/image";
import { useState } from "react";
import type { DayPlan, StopType } from "./types";

const LEGEND: { type: StopType; label: string; icon: string }[] = [
  { type: "visit", label: "入內參觀", icon: "/images/trip-detail/legend-visit.svg" },
  { type: "photo", label: "下車拍照", icon: "/images/trip-detail/legend-photo.svg" },
  { type: "pass", label: "行車經過", icon: "/images/trip-detail/legend-pass.svg" },
];

const LEGEND_ICON: Record<StopType, string> = Object.fromEntries(
  LEGEND.map((l) => [l.type, l.icon]),
) as Record<StopType, string>;

function MealRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex w-12 shrink-0 items-center justify-center rounded-[10px] border border-[#E0E3E8] px-1 py-0.5 text-center text-sm text-[#535F71]">
        {label}
      </span>
      <span className="text-sm text-[#1A1C1E]">{value}</span>
    </div>
  );
}

function DayCard({ day }: { day: DayPlan }) {
  return (
    <div id={`day-${day.day}`} className="flex scroll-mt-28 flex-col items-stretch">
      <div className="flex flex-col gap-3 rounded-[20px] bg-[#ECF1FA] p-5 sm:flex-row">
        <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] border-[rgba(0,83,224,0.1)] bg-[rgba(0,83,224,0.1)]">
          <span className="text-lg font-semibold text-[#002366]">{day.date}</span>
          <span className="font-['TASA_Orbiter'] text-2xl font-semibold text-[#002366]">DAY {day.day}</span>
          <span className="text-lg font-semibold text-[#002366]">{day.weekday}</span>
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-x-1 gap-y-2 py-3">
          {day.stops.map((stop, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && (
                <svg viewBox="0 0 8 13" className="h-3 w-2 shrink-0 fill-[#535F71]">
                  <path d="M0 0 L8 6.5 L0 13 Z" />
                </svg>
              )}
              <Image src={LEGEND_ICON[stop.type]} alt="" width={16} height={16} />
              <span className="text-lg text-black">{stop.name}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px]">
            <Image src="/images/trip-detail/meal-icon.svg" alt="" width={26} height={26} />
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
            <MealRow label="早餐" value={day.meals.breakfast} />
            <MealRow label="午餐" value={day.meals.lunch} />
            <MealRow label="晚餐" value={day.meals.dinner} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px]">
            <Image src="/images/trip-detail/hotel-icon.svg" alt="" width={30} height={30} />
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <span className="flex w-12 shrink-0 items-center justify-center rounded-[10px] border border-[#E0E3E8] px-1 py-0.5 text-center text-sm text-[#535F71]">
              住宿
            </span>
            {day.hotelOptions.map((hotel, i) => (
              <span key={hotel} className="flex items-center gap-2 text-base text-[#1A1C1E]">
                {i > 0 && <span>或</span>}
                {hotel}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-5 pl-0 sm:flex-row sm:pl-8">
          <p className="flex-1 text-base leading-relaxed text-[#4A5058]">{day.description}</p>
          <div className="relative h-[187px] w-full shrink-0 overflow-hidden rounded-[10px] sm:w-[280px]">
            <Image src={day.image} alt="" fill className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailyArrangement({ days }: { days: DayPlan[] }) {
  const [showAllStops, setShowAllStops] = useState(false);

  const scrollToDay = (day: number) => {
    document.getElementById(`day-${day}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="daily" className="flex scroll-mt-28 flex-col gap-[18px] pb-11 pt-10">
      <div className="flex flex-col gap-2 px-2.5">
        <h2 className="font-serif text-2xl font-bold text-[#090909]">每日安排</h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            {LEGEND.map((legend) => (
              <span key={legend.type} className="flex items-center gap-1.5">
                <Image src={legend.icon} alt="" width={18} height={18} />
                <span className="text-xs font-medium text-[#535F71]">{legend.label}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {days.map((day) => (
              <button
                key={day.day}
                type="button"
                onClick={() => scrollToDay(day.day)}
                aria-label={`前往 DAY ${day.day}`}
                className="flex h-[30px] w-9 cursor-pointer items-center justify-center rounded-2xl border border-[#E0E3E8] bg-[#FAFAFA] text-xs font-medium text-[#535F71] transition hover:border-[#0053E0] hover:text-[#0053E0]"
              >
                {day.day}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowAllStops((v) => !v)}
              className="flex h-9 w-[118px] cursor-pointer items-center justify-center rounded-xl border border-[#0053E0] text-[13px] font-medium text-[#0053E0] transition hover:bg-[#ECF1FA]"
            >
              全部景點介紹
            </button>
          </div>
        </div>
      </div>

      {showAllStops && (
        <div className="mx-2.5 flex flex-col gap-2 rounded-[10px] border border-[#E0E3E8] bg-[#FAFAFA] px-[18px] py-3">
          {days.map((day) => (
            <p key={day.day} className="text-[13px] leading-relaxed text-[#535F71]">
              <span className="font-medium text-[#0053E0]">DAY {day.day}：</span>
              {day.stops.map((s) => s.name).join("、")}
            </p>
          ))}
        </div>
      )}

      <div className="flex h-[46px] items-center rounded-[10px] bg-[#FAFAFA] px-[18px]">
        <p className="text-[13px] text-[#535F71]">
          此處行程順序為理想安排；若遇當地交通、天候或特殊狀況，將以行程順暢與安全為原則彈性調整。
        </p>
      </div>

      <div className="flex flex-col divide-y divide-[#E0E3E8] overflow-hidden rounded-[18px] border border-[#E0E3E8] bg-white shadow-[0px_10px_28px_0px_rgba(5,20,41,0.05)]">
        {days.map((day) => (
          <DayCard key={day.day} day={day} />
        ))}
      </div>
    </section>
  );
}
