import type { TripResult } from "./TripResultCard";

export type FilterSection = {
  id: string;
  title: string;
  options: string[];
};

export const FILTER_SECTIONS: FilterSection[] = [
  { id: "duration", title: "旅行天數", options: ["1–5 天", "6–10 天", "11–15 天", "15 天以上"] },
  {
    id: "budget",
    title: "預算（TWD）",
    options: ["20,000 以下", "20,000–40,000", "40,000–70,000", "70,000–120,000", "120,000 以上"],
  },
  {
    id: "month",
    title: "出發月份",
    options: ["春季（3–5 月）", "夏季（6–8 月）", "秋季（9–11 月）", "冬季（12–2 月）"],
  },
];

export const DEFAULT_SELECTED_FILTERS = new Set([
  "6–10 天",
  "40,000–70,000",
  "70,000–120,000",
  "120,000 以上",
  "秋季（9–11 月）",
]);

function matchesDuration(option: string, days: number): boolean {
  switch (option) {
    case "1–5 天":
      return days <= 5;
    case "6–10 天":
      return days >= 6 && days <= 10;
    case "11–15 天":
      return days >= 11 && days <= 15;
    case "15 天以上":
      return days > 15;
    default:
      return false;
  }
}

function matchesBudget(option: string, price: number): boolean {
  switch (option) {
    case "20,000 以下":
      return price < 20000;
    case "20,000–40,000":
      return price >= 20000 && price <= 40000;
    case "40,000–70,000":
      return price > 40000 && price <= 70000;
    case "70,000–120,000":
      return price > 70000 && price <= 120000;
    case "120,000 以上":
      return price > 120000;
    default:
      return false;
  }
}

export function filterTrips(trips: TripResult[], selected: Set<string>): TripResult[] {
  const durationOptions = FILTER_SECTIONS[0].options.filter((o) => selected.has(o));
  const budgetOptions = FILTER_SECTIONS[1].options.filter((o) => selected.has(o));
  const monthOptions = FILTER_SECTIONS[2].options.filter((o) => selected.has(o));

  return trips.filter((trip) => {
    const durationOk =
      durationOptions.length === 0 || durationOptions.some((o) => matchesDuration(o, trip.durationDays));
    const budgetOk = budgetOptions.length === 0 || budgetOptions.some((o) => matchesBudget(o, trip.priceValue));
    const monthOk = monthOptions.length === 0 || monthOptions.includes(trip.season);
    return durationOk && budgetOk && monthOk;
  });
}
