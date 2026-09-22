"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { JourneyStory } from "./data";

function getOffset(index: number, activeIndex: number, length: number) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function slideStyle(offset: number): React.CSSProperties {
  if (offset === 0) {
    return {
      transform: "translateX(-50%) translateY(-50%) scale(1)",
      opacity: 1,
      zIndex: 3,
    };
  }
  if (Math.abs(offset) === 1) {
    const sign = Math.sign(offset);
    return {
      transform: `translateX(calc(-50% + ${sign * 604}px)) translateY(-50%) scale(0.75)`,
      opacity: 0.45,
      zIndex: 2,
    };
  }
  const sign = Math.sign(offset);
  return {
    transform: `translateX(calc(-50% + ${sign * 900}px)) translateY(-50%) scale(0.6)`,
    opacity: 0,
    zIndex: 1,
  };
}

export default function JourneyAlbumOverlay({
  story,
  onClose,
}: {
  story: JourneyStory | null;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const album = story?.album ?? (story ? [{ image: story.image, title: story.title, description: story.quote }] : []);
  const isOpen = story !== null;

  useEffect(() => {
    if (story) setActiveIndex(0);
  }, [story]);

  const goPrev = () => setActiveIndex((i) => (i - 1 + album.length) % album.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % album.length);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose, album.length]);

  if (!isOpen || !story) return null;

  const current = album[activeIndex];

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-r from-[#060d17] via-[#0b131f] to-[#0e1114] animate-[journey-album-fade-in_0.25s_ease]">
      <div className="flex shrink-0 items-center justify-between px-4 pt-6 sm:px-8 lg:px-[120px] lg:pt-[26px]">
        <div className="flex flex-col gap-[5px]">
          <span className="text-[11px] font-semibold tracking-[0.1818em] text-[#99C2FF]">
            JOURNEY ALBUM
          </span>
          <h2 className="font-serif text-xl font-bold text-white sm:text-[27px]">{story.title}</h2>
        </div>

        <div className="flex items-center gap-3.5">
          {album.length > 1 && (
            <div className="flex h-10 w-[102px] items-center justify-center rounded-full border border-white/[0.16] bg-[rgba(137,165,250,0.2)]">
              <span
                key={activeIndex}
                className="text-xs font-semibold tracking-[0.0667em] text-white animate-[journey-album-fade-in_0.2s_ease]"
              >
                {String(activeIndex + 1).padStart(2, "0")} / {String(album.length).padStart(2, "0")}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/[0.18] bg-[rgba(137,165,250,0.2)] transition hover:bg-[rgba(137,165,250,0.32)]"
          >
            <Image src="/images/journey-album-close.svg" alt="" width={20} height={20} />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {album.map((photo, index) => {
          const offset = getOffset(index, activeIndex, album.length);
          if (Math.abs(offset) > 1 && album.length > 3) return null;

          const isCenter = offset === 0;
          const style = slideStyle(offset);

          return (
            <div
              key={photo.image + index}
              aria-hidden={!isCenter}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: isCenter ? "min(100%, 780px)" : "min(23.6%, 340px)",
                aspectRatio: isCenter ? "780 / 520" : "340 / 388",
                transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease",
                ...style,
              }}
              className={`overflow-hidden rounded-[26px] border ${
                isCenter
                  ? "border-white/50 shadow-[0px_24px_48px_0px_rgba(3,10,23,0.28)]"
                  : "pointer-events-none hidden border-white/[0.16] lg:block"
              }`}
            >
              <Image src={photo.image} alt={isCenter ? current.title : ""} fill priority={isCenter} className="object-cover" />
            </div>
          );
        })}

        {album.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="上一張"
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/[0.22] bg-[rgba(137,165,250,0.5)] transition hover:bg-[rgba(137,165,250,0.65)] sm:left-[7%] sm:h-[52px] sm:w-[52px] lg:left-[102px]"
            >
              <Image src="/images/journey-album-arrow-left.svg" alt="" width={22} height={22} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="下一張"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/[0.22] bg-[rgba(137,165,250,0.5)] transition hover:bg-[rgba(137,165,250,0.65)] sm:right-[7%] sm:h-[52px] sm:w-[52px] lg:right-[102px]"
            >
              <Image src="/images/journey-album-arrow-right.svg" alt="" width={22} height={22} />
            </button>
          </>
        )}
      </div>

      <div className="mx-4 mb-6 flex h-[118px] w-[calc(100%-2rem)] max-w-[780px] shrink-0 flex-col justify-center gap-4 self-center overflow-hidden rounded-[20px] border border-white/[0.15] bg-[rgba(137,165,250,0.2)] px-5 py-[18px] sm:flex-row sm:items-center sm:justify-between sm:px-[24px] sm:py-[18px]">
        <div key={`caption-${activeIndex}`} className="flex max-w-[565px] flex-col gap-[5px] overflow-hidden animate-[journey-album-fade-in_0.3s_ease]">
          <h3 className="truncate text-base font-bold text-white">{current.title}</h3>
          <p className="line-clamp-2 text-[13px] leading-[1.65] text-white/90">{current.description}</p>
        </div>
        {album.length > 1 && (
          <span className="text-[11px] text-[#ABCCFF] sm:shrink-0 sm:text-right">左右鍵或 Swipe 滑動</span>
        )}
      </div>
    </div>
  );
}
