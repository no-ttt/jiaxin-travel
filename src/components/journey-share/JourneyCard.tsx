import Image from "next/image";
import type { JourneyStory } from "./data";

const ASPECT_BY_LAYOUT: Record<JourneyStory["layout"], string> = {
  hero: "aspect-[760/420]",
  tall: "aspect-[416/420]",
  small: "aspect-[376/320]",
  wide: "aspect-[800/320]",
};

export default function JourneyCard({ story, onOpen }: { story: JourneyStory; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-white shadow-[0px_8px_20px_0px_rgba(5,18,36,0.08)] ${ASPECT_BY_LAYOUT[story.layout]} lg:aspect-auto lg:h-full`}
    >
      <Image
        src={story.image}
        alt={story.title}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(3,8,15,0.05)] via-[rgba(3,8,15,0.08)] via-52% to-[rgba(3,8,15,0.78)]" />

      {story.hasVideo && (
        <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white">
          <Image src="/images/journey-play-badge.svg" alt="" width={18} height={18} />
        </div>
      )}
    </button>
  );
}
