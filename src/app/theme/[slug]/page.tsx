import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ThemeCollectionView from "@/components/theme-collection/ThemeCollectionView";
import { ApiError } from "@/lib/api/client";
import { getNavigation, getPublicCollection } from "@/lib/api/server";

/** Shared by generateMetadata and the page so the collection is fetched once per request. */
const loadCollection = cache(async (slug: string) => {
  try {
    const collection = await getPublicCollection(slug);
    // Only theme collections live under /theme (保證出團／精緻臻品 have their own pages).
    return { collection: collection.kind === "theme" ? collection : null, failed: false };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return { collection: null, failed: false };
    return { collection: null, failed: true };
  }
});

// The route segment is the collection slug, e.g. theme-1 (hidden themes return 404).
const slugOf = async (params: PageProps<"/theme/[slug]">["params"]) => decodeURIComponent((await params).slug);

export async function generateMetadata({ params }: PageProps<"/theme/[slug]">): Promise<Metadata> {
  const { collection } = await loadCollection(await slugOf(params));
  if (!collection) return { title: "找不到主題｜嘉新旅遊" };
  const title = `${collection.title}｜嘉新旅遊`;
  const description = collection.subtitle || undefined;
  const image = collection.hero ? (collection.hero.variants.hero ?? collection.hero.url) : undefined;
  return { title, description, openGraph: { title, description, images: image ? [image] : undefined } };
}

/** The theme's 產品分類設定 name for the hero label; slug "theme-{id}" names the theme. */
async function themeNameOf(slug: string): Promise<string | null> {
  const themeId = Number(slug.replace(/^theme-/, ""));
  const navigation = await getNavigation().catch(() => null);
  return navigation?.themes.find((theme) => theme.id === themeId)?.name ?? null;
}

export default async function ThemeCollectionPage({ params }: PageProps<"/theme/[slug]">) {
  const slug = await slugOf(params);
  const [{ collection, failed }, themeName] = await Promise.all([loadCollection(slug), themeNameOf(slug)]);
  if (!collection && !failed) notFound();
  return <ThemeCollectionView collection={collection} themeName={themeName} failed={failed} />;
}
