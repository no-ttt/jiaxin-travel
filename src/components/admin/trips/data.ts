import type { PublishStatus, TripListItem, TripType, TripZone } from "@/lib/api/types/trip";

export type TripStatus = PublishStatus;

export type TripKind = TripType;

export type TripRow = {
  id: string;
  name: string;
  kind: TripKind;
  duration: string;
  priceFrom: string;
  status: TripStatus;
  lastEditedLabel: string;
};

function relativeTime(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "剛剛";
  if (minutes < 60) return `${minutes} 分鐘前`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} 小時前`;
  return `${Math.round(hours / 24)} 天前`;
}

export function toTripRow(item: TripListItem): TripRow {
  return {
    id: item.id,
    name: item.product_name || `（未命名）${item.trip_code}`,
    kind: item.trip_type,
    duration: item.duration ?? "—",
    // The list API has no currency field, so show the amount without a currency prefix.
    priceFrom: item.price_from != null ? `${item.price_from.toLocaleString()} 起` : "—",
    status: item.publish_status,
    lastEditedLabel: relativeTime(item.updated_at),
  };
}

export type FilterGroupKey =
  | "region"
  | "theme"
  | "zone"
  | "kind"
  | "status"
  | "days";

export type FilterOption = {
  value: string;
  label: string;
};

export const FILTER_GROUPS: Record<FilterGroupKey, { label: string; options: FilterOption[] }> = {
  // Region / theme options are filled from the taxonomy API at runtime.
  region: { label: "地區", options: [] },
  theme: { label: "主題", options: [] },
  zone: {
    label: "所屬專區",
    options: [
      { value: "overseas_group", label: "國外團體" },
      { value: "theme_travel", label: "主題旅遊" },
      { value: "premium", label: "精緻臻品" },
      { value: "meian", label: "美安專區" },
    ] satisfies { value: TripZone; label: string }[],
  },
  kind: {
    label: "行程類型",
    options: [
      { value: "own", label: "自建" },
      { value: "external", label: "外部連結" },
    ],
  },
  status: {
    label: "上下架狀態",
    options: [
      { value: "published", label: "已上架" },
      { value: "unpublished", label: "已下架" },
      { value: "draft", label: "草稿" },
    ],
  },
  days: {
    label: "天數區間",
    options: [
      { value: "1-5", label: "1-5 天" },
      { value: "6-10", label: "6-10 天" },
      { value: "11+", label: "11 天以上" },
    ],
  },
};

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
  published: "已上架",
  unpublished: "已下架",
  draft: "草稿",
};

export const TRIP_STATUS_STYLE: Record<TripStatus, string> = {
  published: "bg-[#E3F3E5] text-[#1A7F37]",
  unpublished: "bg-[#EDEEF0] text-[#535F71]",
  draft: "bg-[#FDEDD6] text-[#B45309]",
};

export const TRIP_KIND_LABEL: Record<TripKind, string> = {
  own: "自建",
  external: "外部連結",
};

export const TRIP_KIND_STYLE: Record<TripKind, string> = {
  own: "bg-[#0053E0] text-white",
  external: "bg-[#EDEEF0] text-[#535F71]",
};

/** Filter groups the API accepts only one value for. */
export const SINGLE_VALUE_FILTERS: FilterGroupKey[] = ["zone", "kind", "status", "days"];
