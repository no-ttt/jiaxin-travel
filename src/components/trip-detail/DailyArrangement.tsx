"use client";

import Image from "next/image";
import { useState } from "react";
import type { DayPlan, StopType } from "./types";

const LEGEND: { type: StopType; label: string; icon: string }[] = [
  { type: "visit", label: "入內參觀", icon: "/images/trip-detail/legend-visit.svg" },
  { type: "photo", label: "下車拍照", icon: "/images/trip-detail/legend-photo.svg" },
  { type: "pass", label: "行車經過", icon: "/images/trip-detail/legend-pass.svg" },
];

/** Design: 18px label in a white chip (2px 4px padding, 48px text box) — shared by 餐食 and 住宿. */
function InfoLabel({ children }: { children: string }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-[10px] border border-[#E0E3E8] bg-white px-1 py-0.5">
      <span className="w-12 text-center text-lg leading-[1.5] tracking-[-0.011em] text-[#535F71]">{children}</span>
    </span>
  );
}

function MealRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <InfoLabel>{label}</InfoLabel>
      <span className="text-lg leading-[1.5] tracking-[-0.011em] text-[#1A1C1E]">{value}</span>
    </div>
  );
}

/** A day's photos: one at a time, with arrows and a "1 / 3" count once there is more than one. */
function DayPhotos({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const hasMany = images.length > 1;
  const goTo = (next: number) => setIndex((next + images.length) % images.length);

  return (
    <div className="relative h-[187px] w-full shrink-0 overflow-hidden rounded-[10px] sm:w-[280px]">
      <Image src={images[index]} alt="" fill className="object-cover" />
      {hasMany && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[60px] bg-gradient-to-r from-black/10 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[60px] bg-gradient-to-l from-black/10 to-transparent" />
          <button
            type="button"
            aria-label="上一張"
            onClick={() => goTo(index - 1)}
            className="absolute left-0 top-1/2 flex h-12 w-10 -translate-y-1/2 cursor-pointer items-center pl-2.5"
          >
            <Image src="/images/trip-detail/day-photo-prev.svg" alt="" width={14} height={25} />
          </button>
          <button
            type="button"
            aria-label="下一張"
            onClick={() => goTo(index + 1)}
            className="absolute right-0 top-1/2 flex h-12 w-10 -translate-y-1/2 cursor-pointer items-center justify-end pr-2.5"
          >
            <Image src="/images/trip-detail/day-photo-next.svg" alt="" width={14} height={25} />
          </button>
          <span className="absolute right-2.5 top-2.5 rounded-xl bg-black/55 px-2.5 py-1 font-['TASA_Orbiter'] text-[11px] font-semibold text-white">
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}

function DayCard({ day }: { day: DayPlan }) {
  // Fields left blank in the admin are left out (no empty「早餐」label); a row with nothing hides.
  const meals = [
    { label: "早餐", value: day.meals.breakfast },
    { label: "午餐", value: day.meals.lunch },
    { label: "晚餐", value: day.meals.dinner },
  ].filter((meal) => meal.value.trim());
  const hotels = day.hotelOptions.filter((hotel) => hotel.trim());

  return (
    <div id={`day-${day.day}`} className="flex scroll-mt-28 flex-col items-stretch bg-white">
      <div className="flex flex-col gap-3 rounded-[20px] bg-[#ECF1FA] p-5 sm:flex-row">
        <div className="flex h-24 w-24 shrink-0 flex-col items-stretch justify-center rounded-2xl border-[1.5px] border-[rgba(0,83,224,0.1)] bg-[rgba(0,83,224,0.1)] text-center font-['TASA_Orbiter'] font-semibold text-[#002366]">
          <span className="h-6 text-lg leading-6">{day.date}</span>
          <span className="h-8 text-2xl leading-8">DAY {day.day}</span>
          <span className="h-6 text-lg leading-6">{day.weekday}</span>
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-x-1 gap-y-2 py-3">
          {day.stops.map((stop, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center px-[3px]">
                  {/* Design chevron (Figma 270:2467). */}
                  <svg viewBox="0 0 8 13" className="h-[12.57px] w-[7.36px] fill-[#535F71]" aria-hidden="true">
                    <path d="M1.116 13c-.166 0-.31-.029-.433-.085a1.4 1.4 0 0 1-.355-.256A1.08 1.08 0 0 1 0 11.877c0-.302.11-.562.328-.781L4.924 6.5.328 1.904A1.07 1.07 0 0 1 0 1.123C0 .82.11.56.328.341.556.114.819 0 1.116 0s.56.114.788.341l5.384 5.371c.219.228.328.49.328.788s-.11.56-.328.788L1.904 12.659a1.2 1.2 0 0 1-.394.256c-.149.057-.28.085-.394.085" />
                  </svg>
                </span>
              )}
              {/* Design: each stop chip has 12px horizontal padding around the separators. */}
              <span className="px-3 text-lg leading-[1.6] text-black">{stop.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Design: a 1px line runs down the left of the day's details, from the header to the end. */}
      <div className="relative">
        <span aria-hidden="true" className="absolute inset-y-0 left-4 w-px bg-[#002366]" />
        <div className="flex flex-col gap-5 px-6 py-6 sm:px-10">
          {meals.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px]">
                <Image src="/images/trip-detail/meal-icon.svg" alt="" width={26} height={26} />
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-2">
                {meals.map((meal) => (
                  <MealRow key={meal.label} label={meal.label} value={meal.value} />
                ))}
              </div>
            </div>
          )}

          {hotels.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px]">
                <Image src="/images/trip-detail/hotel-icon.svg" alt="" width={30} height={30} />
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <InfoLabel>住宿</InfoLabel>
                {hotels.map((hotel, i) => (
                  <span key={hotel} className="flex items-center gap-3 text-[#1A1C1E]">
                    {i > 0 && <span className="text-base leading-[1.5] tracking-[-0.011em]">或</span>}
                    <span className="text-lg leading-[1.5] tracking-[-0.011em]">{hotel}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Design: its own block (20px 16px 20px 32px), text box padded 8px 12px, 28px to the photo. */}
        <div className="flex flex-col-reverse gap-5 py-5 pl-4 pr-4 sm:flex-row sm:gap-7 sm:pl-8">
          <p className="flex-1 px-3 py-2 text-base leading-[1.6] text-[#4A5058]">{day.description}</p>
          {day.images.length > 0 && <DayPhotos images={day.images} />}
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
        <h2 className="font-serif text-2xl font-bold leading-[1.35] text-[#090909]">每日安排</h2>

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
                className="flex h-[30px] w-9 cursor-pointer items-center justify-center rounded-[15px] border border-[#E0E3E8] bg-[#FAFAFA] font-['TASA_Orbiter'] text-[13px] font-semibold leading-[1.4] text-[#535F71] transition hover:border-[#0053E0] hover:text-[#0053E0]"
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
        <p className="text-[13px] leading-[1.5] text-[#535F71]">
          此處行程順序為理想安排；若遇當地交通、天候或特殊狀況，將以行程順暢與安全為原則彈性調整。
        </p>
      </div>

      {/* Design: day cards sit directly in the section, 18px apart (no outer frame). */}
      {days.map((day) => (
        <DayCard key={day.day} day={day} />
      ))}
    </section>
  );
}
