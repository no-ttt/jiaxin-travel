import Image from "next/image";
import type { JourneyLayout, JourneyStory } from "./data";

const ASPECT_BY_LAYOUT: Record<JourneyLayout, string> = {
  hero: "aspect-[760/420]",
  tall: "aspect-[416/420]",
  small: "aspect-[376/320]",
  wide: "aspect-[800/320]",
};

/** Hover content inset and type sizes per card size (Figma: Journey Share Card, State=Hover). */
const HOVER_BY_LAYOUT: Record<JourneyLayout, { inset: string; title: string; quote: string }> = {
  hero: { inset: "inset-x-7 bottom-5", title: "text-[19px]", quote: "text-sm" },
  tall: { inset: "inset-x-6 bottom-[22px]", title: "text-lg", quote: "text-[13px]" },
  small: { inset: "inset-x-[22px] bottom-[22px]", title: "text-[17px]", quote: "text-[13px]" },
  wide: { inset: "inset-x-[26px] bottom-[22px]", title: "text-lg", quote: "text-[13px]" },
};

export default function JourneyCard({ story, onOpen }: { story: JourneyStory; onOpen: () => void }) {
  const hover = HOVER_BY_LAYOUT[story.layout];
  const cover = story.cover;
  const mediaClass =
    "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={story.title}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-white text-left shadow-[0px_8px_20px_0px_rgba(5,18,36,0.08)] transition-shadow duration-300 hover:shadow-[0px_14px_28px_0px_rgba(5,18,36,0.18)] ${ASPECT_BY_LAYOUT[story.layout]} lg:aspect-auto lg:h-full`}
    >
      {cover?.imageUrl ? (
        <Image
          src={cover.imageUrl}
          alt={story.title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={mediaClass}
        />
      ) : cover?.videoUrl ? (
        <video
          src={cover.videoUrl}
          muted
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full ${mediaClass}`}
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(3,8,15,0.05)] via-[rgba(3,8,15,0.08)] via-52% to-[rgba(3,8,15,0.78)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {cover?.isVideo && (
        <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white">
          <Image src="/images/journey-play-badge.svg" alt="" width={18} height={18} />
        </div>
      )}

      <div
        className={`absolute ${hover.inset} flex translate-y-1 flex-col gap-2 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100`}
      >
        <span className={`truncate font-bold leading-[1.45em] ${hover.title}`}>{story.title}</span>
        {story.quote && <p className={`line-clamp-2 leading-[1.45em] ${hover.quote}`}>{story.quote}</p>}
        <div className="flex items-center justify-between gap-4 pt-5 text-[13px] leading-[1.45em] tracking-[0.1231em]">
          <span className="font-semibold">{story.rating}</span>
          <span className="shrink-0 font-medium">開啟旅程相簿 →</span>
        </div>
      </div>
    </button>
  );
}
