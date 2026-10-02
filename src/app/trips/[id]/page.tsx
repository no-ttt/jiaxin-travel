import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toTripDetail } from "@/components/trip-detail/fromApi";
import TripDetailView from "@/components/trip-detail/TripDetailView";
import { ApiError } from "@/lib/api/client";
import { getPublicTrip } from "@/lib/api/server";

/** Shared by generateMetadata and the page so the trip is fetched once per request. */
const loadTrip = cache(async (tripCode: string) => {
  try {
    return { trip: await getPublicTrip(tripCode), failed: false };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return { trip: null, failed: false };
    return { trip: null, failed: true };
  }
});

// The route segment is the trip code (e.g. CH261001-6JV1).
const tripCodeOf = async (params: PageProps<"/trips/[id]">["params"]) =>
  decodeURIComponent((await params).id);

export async function generateMetadata({ params }: PageProps<"/trips/[id]">): Promise<Metadata> {
  const { trip } = await loadTrip(await tripCodeOf(params));
  if (!trip) return { title: "找不到行程｜嘉新旅遊" };
  const title = `${trip.seo.title || trip.product_name}｜嘉新旅遊`; // 後台「標題」(SEO) wins
  const description = trip.seo.description || trip.cover_headline || undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: trip.seo.og_image ? [trip.seo.og_image] : undefined,
    },
  };
}

export default async function TripDetailPage({ params }: PageProps<"/trips/[id]">) {
  const tripCode = await tripCodeOf(params);
  const { trip, failed } = await loadTrip(tripCode);
  if (!trip && !failed) notFound();

  return <TripDetailView trip={trip ? toTripDetail(trip) : null} failed={failed} />;
}
