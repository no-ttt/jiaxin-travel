"use client";

import { useState } from "react";
import Link from "next/link";
import JourneyCard from "./JourneyCard";
import JourneyAlbumOverlay from "./JourneyAlbumOverlay";
import { JOURNEY_STORIES, type JourneyStory } from "./data";

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 6;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export default function JourneyGallery() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [openStory, setOpenStory] = useState<JourneyStory | null>(null);
  const visibleStories = JOURNEY_STORIES.slice(0, visibleCount);
  const rows = chunk(visibleStories, 2);
  const hasMore = visibleCount < JOURNEY_STORIES.length;

  return (
    <section className="flex flex-col items-center gap-6 bg-[#FAFAFA] px-4 pb-14 pt-6 sm:px-8 lg:px-[120px] lg:pb-[72px]">
      <div className="w-full max-w-[1200px]">
        <h2 className="font-serif text-2xl font-bold text-[#090909] sm:text-[28px]">最近的旅程</h2>
      </div>

      <div className="flex w-full max-w-[1200px] flex-col gap-6">
        {rows.map((row, i) => {
          const rowHeight = row.some((story) => story.layout === "hero" || story.layout === "tall")
            ? "lg:h-[420px]"
            : "lg:h-[320px]";

          return (
            <div key={i} className={`flex flex-col gap-6 lg:flex-row ${rowHeight}`}>
              {row.map((story) => (
                <div
                  key={story.id}
                  className={
                    story.layout === "hero" || story.layout === "wide" ? "lg:flex-[1.83]" : "lg:flex-1"
                  }
                >
                  <JourneyCard story={story} onOpen={() => setOpenStory(story)} />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <JourneyAlbumOverlay story={openStory} onClose={() => setOpenStory(null)} />

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => Math.min(count + LOAD_MORE_COUNT, JOURNEY_STORIES.length))}
          className="flex w-full max-w-[1200px] cursor-pointer items-center justify-center gap-[18px] py-6"
        >
          <span className="h-px flex-1 max-w-[280px] bg-[#E0E3E8]" />
          <span className="text-sm font-semibold tracking-[0.0357em] text-[#535F71] transition hover:text-[#0053E0]">
            更多旅程故事 ↓
          </span>
          <span className="h-px flex-1 max-w-[280px] bg-[#E0E3E8]" />
        </button>
      )}

      <div className="flex w-full max-w-[1200px] flex-col items-center justify-between gap-5 rounded-[20px] bg-[#DBE8FF] px-6 py-7 sm:flex-row sm:px-[28px]">
        <div className="flex max-w-[680px] flex-col gap-[6px] text-center sm:text-left">
          <h3 className="font-serif text-xl font-bold text-[#090909] sm:text-2xl">
            下一張合照，也許就有你。
          </h3>
          <p className="text-sm leading-[1.5] text-[#535F71] sm:text-base">
            想知道哪一趟旅程適合你？可以直接從旅程分享找到靈感，再與專員聊聊。
          </p>
        </div>
        <Link
          href="/search"
          className="flex shrink-0 items-center justify-center rounded-[22px] bg-[#0053E0] px-8 py-3 text-sm font-bold text-white shadow-[0px_8px_18px_-6px_rgba(0,20,56,0.1)] transition hover:bg-[#0044b8]"
        >
          探索近期出發旅程 →
        </Link>
      </div>
    </section>
  );
}
