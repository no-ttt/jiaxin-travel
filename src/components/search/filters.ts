import type { PublicTripSearchParams } from "@/lib/api/types/trip";

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

/** Filter label → API `duration_bands` value. */
const DURATION_BANDS: Record<string, string> = {
  "1–5 天": "1-5",
  "6–10 天": "6-10",
  "11–15 天": "11-15",
  "15 天以上": "15+",
};

/**
 * Filter label → API `budget_bands` value. Unconfirmed: the backend ignored every format
 * tried, so this is a best guess pending the backend's answer.
 */
const BUDGET_BANDS: Record<string, string> = {
  "20,000 以下": "0-20000",
  "20,000–40,000": "20000-40000",
  "40,000–70,000": "40000-70000",
  "70,000–120,000": "70000-120000",
  "120,000 以上": "120000+",
};

/** Season label → API `departure_months`. */
const SEASON_MONTHS: Record<string, number[]> = {
  "春季（3–5 月）": [3, 4, 5],
  "夏季（6–8 月）": [6, 7, 8],
  "秋季（9–11 月）": [9, 10, 11],
  "冬季（12–2 月）": [12, 1, 2],
};

export function filtersToApiParams(
  selected: Set<string>
): Pick<PublicTripSearchParams, "duration_bands" | "budget_bands" | "departure_months"> {
  const picked = [...selected];
  return {
    duration_bands: picked.flatMap((label) => DURATION_BANDS[label] ?? []),
    budget_bands: picked.flatMap((label) => BUDGET_BANDS[label] ?? []),
    departure_months: picked.flatMap((label) => SEASON_MONTHS[label] ?? []),
  };
}
