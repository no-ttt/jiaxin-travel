import type { Metadata } from "next";
import { getHomepage } from "@/lib/api/server";

export const SITE_NAME = "嘉新旅遊";

/** Public site origin, for absolute share-image / page URLs (metadataBase). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.chtravels.com").replace(/\/+$/, "");

/** Fallback description (the 關於我們 intro). */
export const SITE_DESCRIPTION =
  "深耕旅遊產業 30 年，我們用豐富的在地經驗與扎實的專業，為每位旅客把關旅程中的所有細節。";

/** The first homepage banner: the share image for pages without one of their own. */
async function defaultShareImage(): Promise<string | undefined> {
  const homepage = await getHomepage().catch(() => null);
  return homepage?.banners.find((banner) => banner.image)?.image?.url;
}

/**
 * Title, description and LINE／Facebook share card for a page. Next replaces (not merges) a parent's
 * `openGraph`, so every page gets the full set here, falling back to the homepage banner image.
 */
export async function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  /** Page name; the site name is appended (「保證出團｜嘉新旅遊」). Omit for the site name alone. */
  title?: string;
  description?: string | null;
  /** Page path for the share card's link, e.g. "/collections/guaranteed". */
  path?: string;
  /** Absolute URL or a /public path; defaults to the first homepage banner. */
  image?: string | null;
}): Promise<Metadata> {
  const fullTitle = title ? `${title}｜${SITE_NAME}` : `${SITE_NAME} Chia Hsin Travel`;
  const fullDescription = description?.trim() || SITE_DESCRIPTION;
  const shareImage = image || (await defaultShareImage());
  const images = shareImage ? [shareImage] : undefined;
  return {
    title: fullTitle,
    description: fullDescription,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "zh_TW",
      url: path,
      title: fullTitle,
      description: fullDescription,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: fullTitle,
      description: fullDescription,
      images,
    },
  };
}
