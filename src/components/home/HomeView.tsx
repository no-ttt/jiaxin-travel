"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Banner, { type BannerSlide } from "@/components/Banner";
import Sidebar from "@/components/Sidebar";
import VideoLayout, { resolveVideoUrl, type VideoItem } from "@/components/VideoLayout";
import PopularSearch from "@/components/PopularSearch";
import TourCarousel, { type Tour } from "@/components/TourCarousel";
import OurStandards, { type Standard } from "@/components/OurStandards";
import TestimonialCarousel, { type Testimonial } from "@/components/TestimonialCarousel";
import Footer from "@/components/Footer";
import { useHomepage } from "@/lib/api/hooks/useCms";
import { buildSearchHref } from "@/components/search/searchUrl";
import type { Homepage, HomepageTripCard, PublicMedia } from "@/lib/api/types/cms";
import { videoSrc } from "@/lib/api/types/media";

function mediaUrl(media: PublicMedia | null, variant?: "hero" | "card" | "thumb"): string | null {
  if (!media) return null;
  return (variant && media.variants[variant]) || media.url || null;
}

/** 「查看更多」 target per featured section key. */
const MORE_HREF: Record<string, string> = {
  guaranteed: "/guaranteed-departure",
  premium: buildSearchHref({ zone: "premium" }),
  theme: buildSearchHref({ zone: "theme_travel" }),
};

function toTour(trip: HomepageTripCard): Tour {
  return {
    id: trip.trip_code,
    image: mediaUrl(trip.cover, "card"),
    title: trip.product_name,
    description: trip.description,
    price: trip.price_from != null ? trip.price_from.toLocaleString() : "—",
    currency: trip.currency,
    externalUrl: trip.trip_type === "external" ? trip.external_url : null,
  };
}

/** `initialHomepage` is fetched on the server; null when the API was unreachable there. */
export default function HomeView({ initialHomepage }: { initialHomepage: Homepage | null }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: homepage, isLoading, isError } = useHomepage(initialHomepage ?? undefined);

  const banners: BannerSlide[] =
    homepage?.banners.map((banner, i) => ({
      id: `banner-${i}`,
      image: mediaUrl(banner.image, "hero"),
      title: banner.title,
      subtitle: banner.subtitle,
      linkUrl: banner.link_url?.trim() || null,
    })) ?? [];

  const videos: VideoItem[] =
    homepage?.videos.map((video, i) => ({
      id: `video-${i}`,
      thumb: mediaUrl(video.thumb, "card"),
      title: video.title,
      source:
        video.source_type === "upload"
          ? video.video
            ? { type: "file", src: videoSrc(video.video) }
            : null
          : resolveVideoUrl(video.video_url),
    })) ?? [];

  const standards: Standard[] =
    homepage?.brand_features.map((feature, i) => ({
      id: `feature-${i}`,
      icon: mediaUrl(feature.icon),
      title: feature.title,
      description: feature.description,
    })) ?? [];

  const testimonials: Testimonial[] =
    homepage?.testimonials.map((testimonial, i) => ({
      id: `testimonial-${i}`,
      quote: testimonial.content,
      name: testimonial.name,
      meta: testimonial.trip_info,
      rating: testimonial.rating,
      photo: mediaUrl(testimonial.photo, "thumb"),
    })) ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1">
        {isLoading ? (
          <div className="flex h-[520px] items-center justify-center text-sm text-[#94969C]">
            載入首頁資料中…
          </div>
        ) : isError || !homepage ? (
          <div className="flex h-[520px] items-center justify-center text-sm text-[#B45309]">
            首頁資料缺少（API 無回應）
          </div>
        ) : (
          <>
            <Banner slides={banners} />
            <section className="mx-4 my-12 flex flex-col gap-20 sm:mx-8 lg:mx-[120px]">
              <VideoLayout videos={videos} />
              <PopularSearch keywords={homepage.quick_keywords} />
              {homepage.featured_sections.map((section) => (
                <TourCarousel
                  key={section.key}
                  eyebrow={section.eyebrow_en}
                  title={section.title}
                  tours={section.trips.map(toTour)}
                  moreHref={MORE_HREF[section.key]}
                />
              ))}
            </section>
            <OurStandards standards={standards} />
            <TestimonialCarousel testimonials={testimonials} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
