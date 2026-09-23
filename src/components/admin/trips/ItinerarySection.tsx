"use client";

import { useState } from "react";
import { generateId } from "@/components/admin/ui/generateId";

type ImageItem = { id: string; caption: string };

type DayCard = {
  id: string;
  stops: { id: string; value: string }[];
  breakfast: string;
  lunch: string;
  dinner: string;
  accommodation: string;
  description: string;
  images: ImageItem[];
};

const WEEKDAY_LABELS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

function formatDayLabel(startDate: string | undefined, dayIndex: number) {
  if (!startDate) return "尚未設定基準出發日";
  const base = new Date(startDate);
  if (Number.isNaN(base.getTime())) return "尚未設定基準出發日";
  const date = new Date(base);
  date.setDate(date.getDate() + dayIndex);
  const iso = date.toISOString().slice(0, 10);
  const weekday = WEEKDAY_LABELS[date.getDay()];
  return `${iso}（${weekday}）`;
}

const INITIAL_DAYS: DayCard[] = [
  {
    id: generateId("day"),
    stops: [{ id: generateId("stop"), value: "台北桃園機場（TPE）→ 巴黎戴高樂機場（CDG）" }],
    breakfast: "敬請自理",
    lunch: "敬請自理",
    dinner: "機上套餐",
    accommodation: "機上",
    description: "【今日行程】20:40 於桃園國際機場集合，辦理登機手續，搭乘長榮航空直飛巴黎，展開夢幻冰島極光之旅。",
    images: [
      { id: generateId("img"), caption: "" },
      { id: generateId("img"), caption: "" },
    ],
  },
  {
    id: generateId("day"),
    stops: [
      { id: generateId("stop"), value: "巴黎（CDG）→ 雷克雅維克（KEF）" },
      { id: generateId("stop"), value: "哈爾格林姆大教堂" },
      { id: generateId("stop"), value: "太陽航行者號與 Harpa 音樂廳" },
    ],
    breakfast: "機上套餐",
    lunch: "敬請自理",
    dinner: "冰島小龍蝦湯晚餐",
    accommodation: "Canopy by Hilton Reykjavik 或同級",
    description: "抵達冰島後展開首都市區巡禮，造訪哈爾格林姆大教堂、太陽航行者號與托寧湖。",
    images: [
      { id: generateId("img"), caption: "" },
      { id: generateId("img"), caption: "" },
    ],
  },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-[18px] w-1 rounded-sm bg-[#0053E0]" />
      <span className="text-sm font-bold leading-[1.5em] text-[#090909]">{children}</span>
    </div>
  );
}

function RowActionButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#E0E3E8] bg-white px-3 py-2 text-[13px] font-medium leading-[1.45em] text-[#535F71] hover:border-[#0053E0] hover:bg-[#ECF1FA] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E0E3E8] disabled:hover:bg-white"
    >
      {label}
    </button>
  );
}

function MealField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
      <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="敬請自理"
        className="h-11 w-full rounded-lg border border-[#E0E3E8] bg-white px-3.5 text-sm font-medium leading-[1.45em] text-[#090909] outline-none placeholder:text-[#535F71] focus:border-[#0053E0]"
      />
    </div>
  );
}

export default function ItinerarySection({
  title,
  description,
  startDate,
}: {
  title: string;
  description: string;
  startDate?: string;
}) {
  const [days, setDays] = useState<DayCard[]>(INITIAL_DAYS);

  const updateDay = (id: string, patch: Partial<DayCard>) => {
    setDays((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const duplicateDay = (id: string) => {
    setDays((prev) => {
      const index = prev.findIndex((d) => d.id === id);
      if (index === -1) return prev;
      const source = prev[index];
      const copy: DayCard = {
        ...source,
        id: generateId("day"),
        stops: source.stops.map((s) => ({ ...s, id: generateId("stop") })),
        images: source.images.map((img) => ({ ...img, id: generateId("img") })),
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  const moveDayUp = (id: string) => {
    setDays((prev) => {
      const index = prev.findIndex((d) => d.id === id);
      if (index <= 0) return prev;
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const removeDay = (id: string) => {
    setDays((prev) => prev.filter((d) => d.id !== id));
  };

  const addStop = (dayId: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, stops: [...d.stops, { id: generateId("stop"), value: "" }] } : d))
    );
  };

  const updateStop = (dayId: string, stopId: string, value: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId ? { ...d, stops: d.stops.map((s) => (s.id === stopId ? { ...s, value } : s)) } : d
      )
    );
  };

  const removeStop = (dayId: string, stopId: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, stops: d.stops.filter((s) => s.id !== stopId) } : d))
    );
  };

  const addImage = (dayId: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, images: [...d.images, { id: generateId("img"), caption: "" }] } : d))
    );
  };

  const removeImage = (dayId: string, imageId: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, images: d.images.filter((img) => img.id !== imageId) } : d))
    );
  };

  const updateImageCaption = (dayId: string, imageId: string, caption: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, images: d.images.map((img) => (img.id === imageId ? { ...img, caption } : img)) }
          : d
      )
    );
  };

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      {
        id: generateId("day"),
        stops: [],
        breakfast: "",
        lunch: "",
        dinner: "",
        accommodation: "",
        description: "",
        images: [],
      },
    ]);
  };

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">{title}</h2>
          <span className="rounded-full bg-[#ECF1FA] px-2 py-[3px] text-[11px] font-bold leading-[1.45em] text-[#0053E0]">
            僅自建行程適用
          </span>
        </div>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">{description}</p>
      </div>

      <div className="flex flex-col gap-4">
        {days.map((day, index) => (
          <div key={day.id} className="flex flex-col gap-3 rounded-xl border border-[#E0E3E8] p-6">
            {/* Day Header */}
            <div className="flex flex-wrap items-center gap-3.5">
              <span className="flex h-8 w-[88px] shrink-0 items-center justify-center rounded-2xl bg-[#002366] text-sm font-bold leading-[1.5em] text-white">
                DAY {index + 1}
              </span>
              <div className="flex min-w-[220px] flex-1 items-center gap-2">
                <span className="text-base font-bold leading-[1.5em] text-[#090909]">
                  {formatDayLabel(startDate, index)}
                </span>
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <RowActionButton label="複製" onClick={() => duplicateDay(day.id)} />
                <RowActionButton label="上移" onClick={() => moveDayUp(day.id)} disabled={index === 0} />
                <RowActionButton label="刪除" onClick={() => removeDay(day.id)} />
              </div>
            </div>

            {/* 行程點 */}
            <div className="flex flex-col gap-2">
              <FieldLabel>行程點</FieldLabel>
              {day.stops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={stop.value}
                    onChange={(e) => updateStop(day.id, stop.id, e.target.value)}
                    className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
                  />
                  <button
                    type="button"
                    onClick={() => removeStop(day.id, stop.id)}
                    aria-label="移除行程點"
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#535F71] hover:bg-[#FDEDED] hover:text-[#C71A1A]"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addStop(day.id)}
                className="w-fit cursor-pointer text-xs font-medium leading-[1.45em] text-[#0053E0] hover:underline"
              >
                ＋ 新增行程點
              </button>
            </div>

            {/* 餐食 */}
            <div className="flex flex-col gap-2">
              <FieldLabel>餐食</FieldLabel>
              <div className="flex flex-col gap-3 sm:flex-row">
                <MealField label="早餐" value={day.breakfast} onChange={(v) => updateDay(day.id, { breakfast: v })} />
                <MealField label="午餐" value={day.lunch} onChange={(v) => updateDay(day.id, { lunch: v })} />
                <MealField label="晚餐" value={day.dinner} onChange={(v) => updateDay(day.id, { dinner: v })} />
              </div>
            </div>

            {/* 住宿 */}
            <div className="flex flex-col gap-2">
              <FieldLabel>住宿</FieldLabel>
              <input
                type="text"
                value={day.accommodation}
                onChange={(e) => updateDay(day.id, { accommodation: e.target.value })}
                className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
              />
            </div>

            {/* 景點介紹 */}
            <div className="flex flex-col gap-2">
              <FieldLabel>景點介紹</FieldLabel>
              <textarea
                value={day.description}
                onChange={(e) => updateDay(day.id, { description: e.target.value })}
                rows={3}
                className="w-full resize-none rounded-lg border border-[#E0E3E8] bg-white px-3.5 py-3 text-sm font-medium leading-[1.45em] text-[#090909] outline-none focus:border-[#0053E0]"
              />
            </div>

            {/* 行程圖片 */}
            <div className="flex flex-col gap-2">
              <FieldLabel>行程圖片</FieldLabel>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">圖片與註解</span>
                  <span className="text-xs leading-[1.45em] text-[#535F71]">可新增多張並拖曳排序</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {day.images.map((img) => (
                    <div key={img.id} className="flex w-[288px] flex-col gap-2">
                      <div className="relative h-[116px] w-full overflow-hidden rounded-[10px] bg-gradient-to-br from-[#0B1F3A] to-[#1B3A63]">
                        <button
                          type="button"
                          onClick={() => removeImage(day.id, img.id)}
                          aria-label="移除圖片"
                          className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/55 text-xs text-white hover:bg-black/70"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex flex-col gap-[7px]">
                        <span className="text-xs font-medium leading-[1.45em] text-[#090909]">圖片註解</span>
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => updateImageCaption(day.id, img.id, e.target.value)}
                          placeholder="輸入此張行程圖片註解"
                          className="h-[38px] w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-sm leading-[1.5em] text-[#0A0A0C] outline-none placeholder:text-[#535F71] focus:border-[#0053E0]"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex w-[288px] flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => addImage(day.id)}
                      className="flex h-[116px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[#E0E3E8] bg-[#FAFAFA] hover:border-[#0053E0]"
                    >
                      <span className="text-[22px] leading-[1.45em] text-[#0053E0]">＋</span>
                      <span className="text-[13px] font-medium leading-[1.45em] text-[#0053E0]">新增圖片</span>
                    </button>
                    <span className="text-xs leading-[1.45em] text-[#535F71]">支援 JPG / PNG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addDay}
        className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded-lg bg-[#DBE8FF] text-sm font-bold leading-[1.5em] text-[#0053E0] hover:bg-[#CBDCF9]"
      >
        ＋ 新增行程日
      </button>
    </section>
  );
}
