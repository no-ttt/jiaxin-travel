"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  meta: string;
  rating: number;
  photo: string | null;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          className={`h-4 w-4 ${i < rating ? "fill-[#FFB732]" : "fill-[#E0E3E8]"}`}
        >
          <path d="M8 0.5l2.163 4.382 4.837.703-3.5 3.412.826 4.815L8 11.5l-4.326 2.312.826-4.815-3.5-3.412 4.837-.703z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex w-[calc(100vw-48px)] max-w-[560px] shrink-0 flex-col items-start gap-4 rounded-2xl border border-[#E0E3E8] bg-white p-5 shadow-[0px_8px_24px_0px_rgba(0,35,102,0.08)] sm:w-[560px] sm:flex-row sm:items-center sm:gap-6 sm:p-6">
      {testimonial.photo ? (
        <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-2xl">
          <Image src={testimonial.photo} alt="" fill className="object-cover" />
        </div>
      ) : (
        <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-2xl bg-[#F3F3F6] text-xs text-[#94969C]">
          無照片
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3">
        <StarRating rating={testimonial.rating} />
        <p className="text-base text-[#090909]">{testimonial.quote}</p>
        <div className="h-px w-full bg-[#E0E3E8]" />
        <div className="flex flex-col">
          <span className="text-[15px] font-medium text-[#090909]">{testimonial.name}</span>
          <span className="text-[13px] text-[#535F71]">{testimonial.meta}</span>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // How many copies of the list are rendered: enough to cover the scroller plus one spare set,
  // so the auto-scroll can always wrap seamlessly however wide the screen is.
  const [copies, setCopies] = useState(2);
  const loop = testimonials.length > 0 ? Array.from({ length: copies }, () => testimonials).flat() : [];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || testimonials.length === 0) return;

    // Distance from the first card to the first card of the second copy (includes the gap).
    const setWidth = () => {
      const first = scroller.children[0] as HTMLElement | undefined;
      const nextSet = scroller.children[testimonials.length] as HTMLElement | undefined;
      return first && nextSet ? nextSet.offsetLeft - first.offsetLeft : 0;
    };

    const fit = () => {
      const width = setWidth();
      if (width <= 0) return;
      setCopies(Math.max(2, Math.ceil(scroller.clientWidth / width) + 1));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(scroller);

    let frame: number;
    const speed = 0.5;
    // Tracked here because the browser may round scrollLeft, swallowing sub-pixel steps.
    let position = scroller.scrollLeft;

    const step = () => {
      const width = setWidth();
      position += speed;
      if (width > 0 && position >= width) position -= width;
      scroller.scrollLeft = position;
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [testimonials.length]);

  return (
    <section className="flex flex-col gap-8 bg-white py-12 pl-4 sm:pl-8 lg:py-24 lg:pl-[120px]">
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold uppercase tracking-[0.1692em] text-[#0053E0]">
          Client Testimonials
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#121926] sm:text-[34px]">客戶肯定</h2>
      </div>

      {loop.length > 0 ? (
        <div
          ref={scrollerRef}
          className="flex gap-8 overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loop.map((testimonial, i) => (
            <TestimonialCard key={`${testimonial.id}-${i}`} testimonial={testimonial} />
          ))}
        </div>
      ) : (
        <p className="pr-4 text-sm text-[#B45309] sm:pr-8 lg:pr-[120px]">尚無客戶好評資料</p>
      )}
    </section>
  );
}
