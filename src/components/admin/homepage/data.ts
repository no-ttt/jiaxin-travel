import {
  HOMEPAGE_FEATURED_KEYS,
  type HomepageDoc,
  type HomepageDocBanner,
  type HomepageDocBrandFeature,
  type HomepageDocFeatured,
  type HomepageDocTestimonial,
  type HomepageDocVideo,
  type HomepageFeaturedKey,
} from "@/lib/api/types/cms";
import { generateId } from "../ui/generateId";

/** Admin-side editable shapes: API rows plus a client-only `_id` for React keys. */
export type BannerItem = HomepageDocBanner & {
  _id: string;
  /** UI-only: the API has no banner link field yet, so this is never saved. */
  linkUrl: string;
};
export type StoryVideo = HomepageDocVideo & { _id: string };
export type FeatureCard = HomepageDocBrandFeature & { _id: string };
export type TestimonialItem = HomepageDocTestimonial & { _id: string };
export type CategoryTab = HomepageDocFeatured & { key: HomepageFeaturedKey };

export type EditableHomepage = {
  banners: BannerItem[];
  videos: StoryVideo[];
  quick_keywords: string[];
  featured: CategoryTab[];
  brand_features: FeatureCard[];
  testimonials: TestimonialItem[];
};

export function toEditableHomepage(doc: HomepageDoc): EditableHomepage {
  return {
    banners: doc.banners.map((item) => ({ ...item, _id: generateId("banner"), linkUrl: "" })),
    videos: doc.videos.map((item) => ({ ...item, _id: generateId("video") })),
    quick_keywords: [...doc.quick_keywords],
    featured: HOMEPAGE_FEATURED_KEYS.map((key) => ({ ...doc.featured[key], key })),
    brand_features: doc.brand_features.map((item) => ({ ...item, _id: generateId("feature") })),
    testimonials: doc.testimonials.map((item) => ({ ...item, _id: generateId("testimonial") })),
  };
}

function omit<T extends object, K extends keyof T>(item: T, ...keys: K[]): Omit<T, K> {
  const copy = { ...item };
  for (const key of keys) delete copy[key];
  return copy;
}

export function fromEditableHomepage(draft: EditableHomepage): HomepageDoc {
  return {
    banners: draft.banners.map((item) => omit(item, "_id", "linkUrl")),
    videos: draft.videos.map((item) => omit(item, "_id")),
    quick_keywords: draft.quick_keywords,
    featured: Object.fromEntries(
      draft.featured.map((item) => [item.key, omit(item, "key")])
    ) as HomepageDoc["featured"],
    brand_features: draft.brand_features.map((item) => omit(item, "_id")),
    testimonials: draft.testimonials.map((item) => omit(item, "_id")),
  };
}

/** Key-order-insensitive serialization, so a re-built doc compares equal to the server copy. */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) =>
    val && typeof val === "object" && !Array.isArray(val)
      ? Object.fromEntries(Object.entries(val).sort(([a], [b]) => a.localeCompare(b)))
      : val
  );
}

export function isSameHomepage(a: HomepageDoc, b: HomepageDoc): boolean {
  return stableStringify(a) === stableStringify(b);
}
