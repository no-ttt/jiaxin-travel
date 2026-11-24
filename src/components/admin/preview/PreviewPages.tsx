"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import HomeView from "@/components/home/HomeView";
import TermsView from "@/components/terms/TermsView";
import VisaView from "@/components/visa/VisaView";
import JourneyShareView from "@/components/journey-share/JourneyShareView";
import { cmsApi } from "@/lib/api/endpoints/cms";
import { tripsApi } from "@/lib/api/endpoints/trips";
import { JOURNEYS_KEY } from "@/lib/api/hooks/useJourneys";
import {
  HOMEPAGE_FEATURED_KEYS,
  type ContractPage,
  type FooterDoc,
  type FraudNoticePage,
  type Homepage,
  type HomepageDoc,
  type HomepageTripCard,
  type Navigation,
  type PolicyPage,
  type PurchaseFlowPage,
  type VisaDownload,
  type VisaServiceDetail,
  type VisaServices,
} from "@/lib/api/types/cms";
import type { Media } from "@/lib/api/types/media";
import type { TripDetail } from "@/lib/api/types/trip";
import type { CategoriesDraft } from "../categories/data";
import type { JourneyCard } from "../journey-share/data";
import { useMediaMap } from "./useMediaMap";
import type { PreviewKey } from "./draft-store";

type MediaOf = (id: string | null | undefined) => Media | null;

/**
 * Puts `data` into the preview's query cache under `queryKey` (where the site's components read
 * it) and renders `children` only once it is there, so they never fetch the saved copy instead.
 */
function Seeded({ entries, children }: { entries: [readonly unknown[], unknown][]; children: ReactNode }) {
  const queryClient = useQueryClient();
  const seed = () => {
    for (const [key, data] of entries) queryClient.setQueryData(key, data);
  };
  // First render: before the children mount (so nothing reads the cache yet).
  useState(seed);
  // Later drafts: the children are subscribed and re-render with the new data.
  const signature = JSON.stringify(entries);
  useEffect(() => {
    seed();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `signature` covers `entries`
  }, [queryClient, signature]);
  return <>{children}</>;
}

// ---------- 官網首頁 ----------

function toTripCard(trip: TripDetail): HomepageTripCard {
  return {
    trip_code: trip.trip_code,
    trip_type: trip.trip_type,
    product_name: trip.cover.product_name,
    description: trip.cover.product_description,
    cover: trip.cover.cover_media,
    price_from: trip.basic.price_from,
    currency: trip.basic.currency,
    duration_days: trip.cover.duration_days,
    badge: null,
    status: null,
    image_summary: trip.basic.image_summary,
    external_url: trip.basic.external_url,
  };
}

function toHomepage(doc: HomepageDoc, media: MediaOf, trips: Map<string, TripDetail>): Homepage {
  return {
    banners: doc.banners.map((banner) => ({
      title: banner.title,
      subtitle: banner.subtitle,
      image: media(banner.media_id),
      link_url: banner.link_url,
      open_in_new_tab: banner.open_in_new_tab,
    })),
    videos: doc.videos.map((video) => ({
      title: video.title,
      source_type: video.source_type,
      video_url: video.video_url,
      video: media(video.video_media_id),
      thumb: media(video.thumb_media_id),
    })),
    quick_keywords: doc.quick_keywords,
    featured_sections: HOMEPAGE_FEATURED_KEYS.filter((key) => doc.featured[key]?.visible).map((key) => ({
      key,
      eyebrow_en: doc.featured[key].eyebrow_en,
      title: doc.featured[key].title,
      trips: doc.featured[key].trip_ids.flatMap((id) => {
        const trip = trips.get(id);
        return trip ? [toTripCard(trip)] : [];
      }),
    })),
    brand_features: doc.brand_features.map((feature) => ({
      icon: media(feature.icon_media_id),
      title: feature.title,
      description: feature.description,
    })),
    testimonials: doc.testimonials.map((t) => ({
      name: t.name,
      trip_info: t.trip_info,
      rating: t.rating,
      content: t.content,
      photo: media(t.photo_media_id),
    })),
  };
}

function HomepagePreview({ doc }: { doc: HomepageDoc }) {
  const media = useMediaMap([
    ...doc.banners.map((b) => b.media_id),
    ...doc.videos.flatMap((v) => [v.video_media_id, v.thumb_media_id]),
    ...doc.brand_features.map((f) => f.icon_media_id),
    ...doc.testimonials.map((t) => t.photo_media_id),
  ]);
  const tripIds = [...new Set(HOMEPAGE_FEATURED_KEYS.flatMap((key) => doc.featured[key]?.trip_ids ?? []))];
  const tripResults = useQueries({
    queries: tripIds.map((id) => ({ queryKey: ["trips", id], queryFn: () => tripsApi.get(id) })),
  });
  const trips = new Map<string, TripDetail>();
  tripResults.forEach((result) => {
    if (result.data) trips.set(result.data.id, result.data);
  });
  const homepage = toHomepage(doc, media, trips);
  return (
    <Seeded entries={[[["public", "homepage"], homepage]]}>
      <HomeView initialHomepage={homepage} />
    </Seeded>
  );
}

// ---------- 產品分類設定（側邊欄）/ 網站頁尾設定: shown on the saved homepage ----------

function SavedHomepage({ initialSidebarOpen = false }: { initialSidebarOpen?: boolean }) {
  const { data: homepage, isPending } = useQuery({
    queryKey: ["public", "homepage"],
    queryFn: () => cmsApi.homepage(),
  });
  if (isPending) return null;
  return <HomeView initialHomepage={homepage ?? null} initialSidebarOpen={initialSidebarOpen} />;
}

/** Saved-but-unsaved rows have no id yet; give them a stable negative one for React keys. */
const draftId = (id: number | null, index: number) => id ?? -(index + 1);

function toNavigation(draft: CategoriesDraft): Navigation {
  return {
    categories: draft.categories.map((category) => ({
      key: category.key,
      display_name: category.displayName,
      submenu_enabled: category.submenuEnabled,
      redirect_url: category.redirectUrl.trim() || null,
    })),
    regions: draft.regions.map((region, i) => ({ id: draftId(region.id, i), name: region.name })),
    themes: draft.themes
      .filter((theme) => theme.visible)
      .map((theme, i) => ({ id: draftId(theme.id, i), name: theme.name, collection_id: theme.collectionId ?? 0 })),
    premium_subcategories: draft.premiumSubcategories
      .filter((sub) => sub.visible)
      .map((sub, i) => ({ id: draftId(sub.id, i), name: sub.name })),
  };
}

function CategoriesPreview({ draft }: { draft: CategoriesDraft }) {
  return (
    <Seeded entries={[[["public", "navigation"], toNavigation(draft)]]}>
      <SavedHomepage initialSidebarOpen />
    </Seeded>
  );
}

function FooterPreview({ doc }: { doc: FooterDoc }) {
  const media = useMediaMap([doc.logo_media_id]);
  const { logo_media_id, ...rest } = doc;
  const footer = { ...rest, logo: media(logo_media_id) };
  return (
    <Seeded entries={[[["public", "footer"], footer]]}>
      <SavedHomepage />
    </Seeded>
  );
}

// ---------- 旅客須知 tabs (訂購流程／取消退訂／契約書／防詐騙／聲明公告) ----------

const TERMS_KEYS = ["purchase-flow", "cancellation-policy", "contract", "fraud-notice", "announcements"] as const;
type TermsKey = (typeof TERMS_KEYS)[number];

const visibleSections = (page: PolicyPage): PolicyPage => ({
  ...page,
  sections: (page.sections ?? []).filter((section) => section.visible !== false),
});

function TermsPreview({ pageKey, doc }: { pageKey: TermsKey; doc: unknown }) {
  // The other tabs show what's saved.
  const saved = useQueries({
    queries: TERMS_KEYS.map((key) => ({
      queryKey: ["public", "page", key],
      queryFn: () => cmsApi.page(key).catch(() => null),
    })),
  });
  const contractDoc = pageKey === "contract" ? (doc as ContractPage) : null;
  const media = useMediaMap([contractDoc?.doc_media_id]);
  if (saved.some((result) => result.isPending)) return null;

  const pages = Object.fromEntries(TERMS_KEYS.map((key, i) => [key, saved[i].data ?? null])) as Record<
    TermsKey,
    unknown
  >;
  if (pageKey === "purchase-flow") {
    const flow = doc as PurchaseFlowPage;
    pages[pageKey] = { ...flow, steps: flow.steps.filter((step) => step.visible) };
  } else if (pageKey === "cancellation-policy" || pageKey === "announcements") {
    pages[pageKey] = visibleSections(doc as PolicyPage);
  } else if (contractDoc) {
    const file = media(contractDoc.doc_media_id);
    pages[pageKey] = { ...contractDoc, doc_url: contractDoc.doc_media_id ? (file?.url ?? "") : contractDoc.doc_url };
  } else {
    pages[pageKey] = doc as FraudNoticePage;
  }

  const purchaseFlow = pages["purchase-flow"] as PurchaseFlowPage | null;
  return (
    // The footer hides its 匯款資訊 link from 訂購流程's payment switch, so show the draft's there too.
    <Seeded entries={purchaseFlow ? [[["public", "purchase-flow"], purchaseFlow]] : []}>
      <TermsView
        purchaseFlow={purchaseFlow}
        cancellationPolicy={pages["cancellation-policy"] as PolicyPage | null}
        contract={pages.contract as ContractPage | null}
        fraudNotice={pages["fraud-notice"] as FraudNoticePage | null}
        announcements={pages.announcements as PolicyPage | null}
      />
    </Seeded>
  );
}

// ---------- 護照及簽證代辦 ----------

function visaMediaIds(doc: VisaServices): (string | null)[] {
  const details = [...doc.passport_items, ...doc.visa_items].map((item) => item.detail);
  return details.flatMap((detail) => [
    ...detail.downloads.map((file) => file.media_id),
    ...detail.required_docs.flatMap((section) => section.downloads.map((file) => file.media_id)),
  ]);
}

function toPublicVisa(doc: VisaServices, media: MediaOf): VisaServices {
  const resolve = <T extends VisaDownload>(file: T): T =>
    file.media_id ? { ...file, url: media(file.media_id)?.url ?? "" } : file;
  const detail = (d: VisaServiceDetail): VisaServiceDetail => ({
    ...d,
    required_docs: d.required_docs.map((section) => ({ ...section, downloads: section.downloads.map(resolve) })),
    downloads: d.downloads.map(resolve),
  });
  return {
    ...doc,
    passport_items: doc.passport_items.filter((item) => item.visible).map((item) => ({ ...item, detail: detail(item.detail) })),
    visa_items: doc.visa_items.filter((item) => item.visible).map((item) => ({ ...item, detail: detail(item.detail) })),
  };
}

function VisaPreview({ doc }: { doc: VisaServices }) {
  const media = useMediaMap(visaMediaIds(doc));
  return <VisaView visaServices={toPublicVisa(doc, media)} />;
}

// ---------- 旅程分享 ----------

const journeyId = (card: JourneyCard) => card.id ?? card.key;

function JourneysPreview({ cards }: { cards: JourneyCard[] }) {
  const visible = cards.filter((card) => card.visible);
  const media = useMediaMap(visible.flatMap((card) => [card.coverMediaId, ...card.media.map((m) => m.mediaId)]));
  const journeys = {
    items: visible.map((card) => ({
      id: journeyId(card),
      name: card.name,
      quote: card.review,
      rating_text: card.rating,
      album_title: card.albumTitle,
      cover: media(card.coverMediaId),
    })),
  };
  // Albums edited in this session come from the draft; the rest load from the API as saved.
  const albums: [readonly unknown[], unknown][] = visible
    .filter((card) => card.albumLoaded)
    .map((card) => [
      [...JOURNEYS_KEY, "public", journeyId(card), "album"],
      {
        album_title: card.albumTitle,
        items: card.media.map((m) => ({ media: media(m.mediaId), caption: m.caption })),
      },
    ]);
  return (
    <Seeded entries={albums}>
      <JourneyShareView journeys={journeys} />
    </Seeded>
  );
}

export function PreviewPage({ pageKey, draft }: { pageKey: PreviewKey; draft: unknown }) {
  switch (pageKey) {
    case "homepage":
      return <HomepagePreview doc={draft as HomepageDoc} />;
    case "categories":
      return <CategoriesPreview draft={draft as CategoriesDraft} />;
    case "footer":
      return <FooterPreview doc={draft as FooterDoc} />;
    case "visa-services":
      return <VisaPreview doc={draft as VisaServices} />;
    case "journeys":
      return <JourneysPreview cards={draft as JourneyCard[]} />;
    default:
      return <TermsPreview pageKey={pageKey} doc={draft} />;
  }
}
