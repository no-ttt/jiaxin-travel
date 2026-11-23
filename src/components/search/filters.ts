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

/** Filter label → API `duration_bands` value (also the `duration` URL param). */
const DURATION_BANDS: Record<string, string> = {
  "1–5 天": "1-5",
  "6–10 天": "6-10",
  "11–15 天": "11-15",
  "15 天以上": "15+",
};

/** Filter label → API `budget_bands` value, matched against price_from (also the `budget` URL param). */
const BUDGET_BANDS: Record<string, string> = {
  "20,000 以下": "lt20k",
  "20,000–40,000": "20-40k",
  "40,000–70,000": "40-70k",
  "70,000–120,000": "70-120k",
  "120,000 以上": "120k+",
};

/** Season label → `season` URL param. */
const SEASONS: Record<string, string> = {
  "春季（3–5 月）": "spring",
  "夏季（6–8 月）": "summer",
  "秋季（9–11 月）": "autumn",
  "冬季（12–2 月）": "winter",
};

/** Season → API `departure_months`. */
const SEASON_MONTHS: Record<string, number[]> = {
  spring: [3, 4, 5],
  summer: [6, 7, 8],
  autumn: [9, 10, 11],
  winter: [12, 1, 2],
};

/** Selected side-panel filters as URL / API codes. */
export type FilterCodes = { durations: string[]; budgets: string[]; seasons: string[] };

export const EMPTY_FILTER_CODES: FilterCodes = { durations: [], budgets: [], seasons: [] };

export const VALID_FILTER_CODES = {
  durations: Object.values(DURATION_BANDS),
  budgets: Object.values(BUDGET_BANDS),
  seasons: Object.values(SEASONS),
};

const GROUPS = [
  ["durations", DURATION_BANDS],
  ["budgets", BUDGET_BANDS],
  ["seasons", SEASONS],
] as const;

/** Codes from the URL → the option labels shown as checked in the panel / chips. */
export function codesToLabels(codes: FilterCodes): Set<string> {
  const labels = new Set<string>();
  for (const [key, map] of GROUPS) {
    for (const [label, code] of Object.entries(map)) {
      if (codes[key].includes(code)) labels.add(label);
    }
  }
  return labels;
}

/** Checked option labels → codes, kept in the panel's option order. */
export function labelsToCodes(labels: Set<string>): FilterCodes {
  const pick = (map: Record<string, string>) =>
    Object.entries(map).flatMap(([label, code]) => (labels.has(label) ? [code] : []));
  return { durations: pick(DURATION_BANDS), budgets: pick(BUDGET_BANDS), seasons: pick(SEASONS) };
}

export function filtersToApiParams(
  codes: FilterCodes
): Pick<PublicTripSearchParams, "duration_bands" | "budget_bands" | "departure_months"> {
  return {
    duration_bands: codes.durations,
    budget_bands: codes.budgets,
    departure_months: codes.seasons.flatMap((season) => SEASON_MONTHS[season] ?? []),
  };
}
