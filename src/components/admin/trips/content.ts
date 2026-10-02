import { generateId } from "@/components/admin/ui/generateId";
import type {
  DayIn,
  FeatureCardIn,
  FlightsPayload,
  NoticeTabIn,
  TripDetail,
  TripImage,
} from "@/lib/api/types/trip";

/**
 * Editable shapes for editor steps 03–06. Each row carries a client-only `_id` for React keys;
 * `to*Payload` strips it before sending to the matching PUT endpoint.
 */
export type EditableImage = { _id: string; media_id: string; caption: string };

export type EditableFeatureCard = {
  _id: string;
  title: string;
  body_html: string;
  images: EditableImage[];
  /** UI-only: collapsed/expanded state. */
  expanded: boolean;
};

export type EditableFlightRow = {
  _id: string;
  flight_date: string;
  airline_flight: string;
  depart_time: string;
  depart_city: string;
  arrive_time: string;
  arrive_city: string;
  day_offset: number;
  leg_label: string | null;
};

export type EditableFlights = { note: string; rows: EditableFlightRow[] };

export type EditableDay = {
  _id: string;
  points: { _id: string; value: string }[];
  breakfast: string;
  lunch: string;
  dinner: string;
  lodging: string;
  description: string;
  images: EditableImage[];
};

export type EditableNoticeTab = { _id: string; title: string; body_html: string; visible: boolean };

export type TripContent = {
  featureCards: EditableFeatureCard[];
  flights: EditableFlights;
  days: EditableDay[];
  noticeTabs: EditableNoticeTab[];
};

const toEditableImages = (images: TripImage[]): EditableImage[] =>
  images.map((img) => ({ _id: generateId("img"), media_id: img.media.id, caption: img.caption }));

const toImagePayload = (images: EditableImage[]) =>
  images.map(({ media_id, caption }) => ({ media_id, caption }));

/** "23:05:00" → "23:05" */
const trimSeconds = (time: string | null) => (time ? time.slice(0, 5) : "");

export function toTripContent(detail: TripDetail): TripContent {
  return {
    featureCards: detail.feature_cards.map((card, index) => ({
      _id: generateId("card"),
      title: card.title,
      body_html: card.body_html,
      images: toEditableImages(card.images),
      expanded: index === 0,
    })),
    flights: {
      note: detail.flights.note,
      rows: detail.flights.rows.map((row) => ({
        _id: generateId("flight"),
        flight_date: row.flight_date ?? "",
        airline_flight: row.airline_flight,
        depart_time: trimSeconds(row.depart_time),
        depart_city: row.depart_city,
        arrive_time: trimSeconds(row.arrive_time),
        arrive_city: row.arrive_city,
        day_offset: row.day_offset,
        leg_label: row.leg_label,
      })),
    },
    days: detail.days.map((day) => ({
      _id: generateId("day"),
      // Always show at least one (empty) point input; empty points are dropped on save.
      points: (day.points.length ? day.points : [""]).map((value) => ({ _id: generateId("stop"), value })),
      breakfast: day.breakfast,
      lunch: day.lunch,
      dinner: day.dinner,
      lodging: day.lodging,
      description: day.description,
      images: toEditableImages(day.images),
    })),
    noticeTabs: detail.notice_tabs.map((tab) => ({ _id: generateId("tab"), ...tab })),
  };
}

export const toFeatureCardsPayload = (cards: EditableFeatureCard[]): FeatureCardIn[] =>
  cards.map((card) => ({
    title: card.title,
    body_html: card.body_html,
    images: toImagePayload(card.images),
  }));

export const toFlightsPayload = (flights: EditableFlights): FlightsPayload => ({
  note: flights.note,
  rows: flights.rows.map((row) => ({
    flight_date: row.flight_date || null,
    airline_flight: row.airline_flight,
    depart_time: row.depart_time || null,
    depart_city: row.depart_city,
    arrive_time: row.arrive_time || null,
    arrive_city: row.arrive_city,
    day_offset: row.day_offset,
    leg_label: row.leg_label,
  })),
});

export const toDaysPayload = (days: EditableDay[]): DayIn[] =>
  days.map((day, index) => ({
    day_number: index + 1,
    points: day.points.map((point) => point.value).filter((value) => value.trim()),
    breakfast: day.breakfast,
    lunch: day.lunch,
    dinner: day.dinner,
    lodging: day.lodging,
    description: day.description,
    images: toImagePayload(day.images),
  }));

export const toNoticeTabsPayload = (tabs: EditableNoticeTab[]): NoticeTabIn[] =>
  tabs.map(({ title, body_html, visible }) => ({ title, body_html, visible }));

const TIME_PATTERN = /^([01]?\d|2[0-3]):[0-5]\d$/;

/** Returns an error message for the first invalid flight time, or null. */
export function validateFlights(flights: EditableFlights): string | null {
  for (const [index, row] of flights.rows.entries()) {
    for (const [label, time] of [
      ["起飛", row.depart_time],
      ["抵達", row.arrive_time],
    ] as const) {
      if (time && !TIME_PATTERN.test(time)) {
        return `第 ${index + 1} 筆航班的${label}時間「${time}」格式錯誤，請輸入 HH:MM，例如 23:05`;
      }
    }
  }
  return null;
}

export function createEmptyDay(): EditableDay {
  return {
    _id: generateId("day"),
    points: [{ _id: generateId("stop"), value: "" }],
    breakfast: "",
    lunch: "",
    dinner: "",
    lodging: "",
    description: "",
    images: [],
  };
}

export function isDayEmpty(day: EditableDay): boolean {
  return (
    day.points.every((point) => !point.value.trim()) &&
    !day.breakfast.trim() &&
    !day.lunch.trim() &&
    !day.dinner.trim() &&
    !day.lodging.trim() &&
    !day.description.trim() &&
    day.images.length === 0
  );
}

/** Inclusive day count between two ISO dates, or null when the range is missing/invalid. */
export function countDaysInRange(start: string | null, end: string | null): number | null {
  if (!start || !end) return null;
  const from = new Date(start);
  const to = new Date(end);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return null;
  return Math.round((to.getTime() - from.getTime()) / 86400000) + 1;
}

/**
 * Grows or shrinks the day list to `target` cards. Extra trailing cards are dropped only if
 * they are empty, or if `confirmDrop` approves dropping the ones that have content;
 * returns null when the user declines.
 */
export function syncDayCount(
  days: EditableDay[],
  target: number,
  confirmDrop: (count: number) => boolean
): EditableDay[] | null {
  if (days.length < target) {
    return [...days, ...Array.from({ length: target - days.length }, createEmptyDay)];
  }
  if (days.length > target) {
    const extra = days.slice(target);
    const filled = extra.filter((day) => !isDayEmpty(day)).length;
    if (filled > 0 && !confirmDrop(filled)) return null;
    return days.slice(0, target);
  }
  return days;
}

/** Moves the item with `fromId` to the position of `toId`; returns the same array if either is missing. */
export function moveById<T extends { _id: string }>(items: T[], fromId: string, toId: string): T[] {
  const from = items.findIndex((item) => item._id === fromId);
  const to = items.findIndex((item) => item._id === toId);
  if (from === -1 || to === -1 || from === to) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
