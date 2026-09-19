"use client";

import Image from "next/image";
import { useState } from "react";

const SLIDE_WIDTH = 600;
const GAP = 12;

export default function ImageCarousel({ images, caption }: { images: string[]; caption: string }) {
  const [index, setIndex] = useState(0);

  if (images.length === 1) {
    return (
      <div className="flex flex-col items-center gap-2.5">
        <div className="relative h-[400px] w-[600px] max-w-full overflow-hidden rounded-2xl">
          <Image src={images[0]} alt="" fill className="object-cover" />
        </div>
        <p className="text-[13px] text-[#535F71]">{caption}</p>
      </div>
    );
  }

  const goTo = (next: number) => setIndex((next + images.length) % images.length);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative h-[400px] w-full max-w-[876px] overflow-hidden">
        <div
          className="flex h-full items-center transition-transform duration-300 ease-out"
          style={{
            gap: GAP,
            transform: `translateX(calc(50% - ${SLIDE_WIDTH / 2}px - ${index * (SLIDE_WIDTH + GAP)}px))`,
          }}
        >
          {images.map((image, i) => {
            const isActive = i === index;
            return (
              <div
                key={image + i}
                className={`relative h-[400px] w-[600px] max-w-[80vw] shrink-0 overflow-hidden rounded-2xl transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-50"
                }`}
              >
                <Image src={image} alt="" fill className="object-cover" />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="上一張"
          onClick={() => goTo(index - 1)}
          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E0E3E8] bg-white shadow-[0px_4px_14px_0px_rgba(5,20,41,0.14)] transition hover:bg-slate-50"
        >
          <Image src="/images/trip-detail/gallery-arrow-left.svg" alt="" width={20} height={20} />
        </button>
        <button
          type="button"
          aria-label="下一張"
          onClick={() => goTo(index + 1)}
          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E0E3E8] bg-white shadow-[0px_4px_14px_0px_rgba(5,20,41,0.14)] transition hover:bg-slate-50"
        >
          <Image src="/images/trip-detail/gallery-arrow-right.svg" alt="" width={20} height={20} />
        </button>

        <div className="absolute right-4 top-4 flex h-[30px] items-center justify-center rounded-full bg-black/60 px-3">
          <span className="text-[11px] font-semibold text-white">
            {index + 1} / {images.length}
          </span>
        </div>
      </div>
      <p className="text-[13px] text-[#535F71]">{caption}</p>
    </div>
  );
}
