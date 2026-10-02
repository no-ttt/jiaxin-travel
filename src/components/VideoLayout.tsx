"use client";

import { useState } from "react";
import Image from "next/image";

export type VideoSource = { type: "embed"; src: string } | { type: "file"; src: string };

export type VideoItem = {
  id: string;
  thumb: string | null;
  title: string;
  source: VideoSource | null;
};

/** Turns a YouTube / Vimeo page URL into an embeddable player URL; other URLs play as files. */
export function resolveVideoUrl(url: string | null | undefined): VideoSource | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^www\.|^m\./, "");

  let youtubeId: string | null = null;
  if (host === "youtu.be") youtubeId = parsed.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    youtubeId =
      parsed.searchParams.get("v") ??
      parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ??
      null;
  }
  if (youtubeId) {
    return { type: "embed", src: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0` };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const vimeoId = parsed.pathname.match(/(\d+)/)?.[1];
    if (vimeoId) return { type: "embed", src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1` };
  }

  return { type: "file", src: url };
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 11 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M10.5 6L0.75 11.4952V0.504809L10.5 6Z" fill="#002366" />
    </svg>
  );
}

function VideoCard({
  video,
  variant = "supporting",
}: {
  video: VideoItem;
  variant?: "featured" | "supporting";
}) {
  const isFeatured = variant === "featured";
  const [isPlaying, setIsPlaying] = useState(false);
  const roundedClass = isFeatured ? "rounded-2xl sm:rounded-3xl" : "rounded-2xl";

  if (isPlaying && video.source) {
    return (
      <div
        className={`absolute inset-0 overflow-hidden bg-black shadow-[0px_8px_24px_0px_rgba(0,35,102,0.1)] ${roundedClass}`}
      >
        {video.source.type === "embed" ? (
          <iframe
            src={video.source.src}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <video src={video.source.src} controls autoPlay playsInline className="h-full w-full" />
        )}
      </div>
    );
  }

  return (
    <div
      role={video.source ? "button" : undefined}
      tabIndex={video.source ? 0 : undefined}
      aria-label={video.source ? `播放 ${video.title}` : undefined}
      onClick={() => video.source && setIsPlaying(true)}
      onKeyDown={(e) => {
        if (video.source && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setIsPlaying(true);
        }
      }}
      className={`group absolute inset-0 cursor-pointer overflow-hidden shadow-[0px_8px_24px_0px_rgba(0,35,102,0.1)] ${roundedClass}`}
    >
      {video.thumb ? (
        <Image
          src={video.thumb}
          alt={video.title}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E0E3E8] text-sm text-[#94969C]">
          無縮圖
        </div>
      )}
      <div className="absolute inset-0 bg-[#002366]/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/64" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`flex items-center justify-center rounded-full border border-[#E0E3E8]/90 bg-white/90 transition-transform group-hover:scale-110 ${
            isFeatured ? "h-14 w-14 sm:h-[72px] sm:w-[72px]" : "h-10 w-10"
          }`}
        >
          <PlayIcon
            className={isFeatured ? "h-4 w-4 sm:h-[18px] sm:w-[16.5px]" : "h-[10px] w-[9px]"}
          />
        </div>
      </div>

      <div
        className={`absolute left-4 text-white sm:left-6 ${
          isFeatured ? "bottom-6 sm:left-9 sm:bottom-9" : "bottom-4"
        }`}
      >
        <h3
          className={`font-bold ${
            isFeatured ? "text-2xl sm:text-4xl" : "text-lg"
          }`}
        >
          {video.title}
        </h3>
      </div>
    </div>
  );
}

export default function VideoLayout({ videos }: { videos: VideoItem[] }) {
  const count = Math.min(videos.length, 3);

  if (count === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-[#F3F3F6] text-sm text-[#B45309]">
        尚無旅遊故事影片
      </div>
    );
  }

  if (count === 1) {
    return (
      <div className="relative aspect-video w-full">
        <VideoCard video={videos[0]} variant="featured" />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <div className="relative aspect-video flex-1">
          <VideoCard video={videos[0]} variant="featured" />
        </div>
        <div className="relative aspect-video flex-1">
          <VideoCard video={videos[1]} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
      <div className="relative aspect-video sm:aspect-auto sm:flex-[2]">
        <VideoCard video={videos[0]} variant="featured" />
      </div>
      <div className="flex flex-row gap-4 sm:flex-1 sm:flex-col">
        <div className="relative aspect-video flex-1">
          <VideoCard video={videos[1]} />
        </div>
        <div className="relative aspect-video flex-1">
          <VideoCard video={videos[2]} />
        </div>
      </div>
    </div>
  );
}
