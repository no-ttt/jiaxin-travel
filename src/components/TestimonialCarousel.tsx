"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Photo = { kind: "photo"; image: string };
type Stamp = { kind: "stamp"; code: string; label: string };

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  meta: string;
  photo: Photo | Stamp;
};

function StarRating() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 16 16" className="h-4 w-4 fill-[#FFB732]">
          <path d="M8 0.5l2.163 4.382 4.837.703-3.5 3.412.826 4.815L8 11.5l-4.326 2.312.826-4.815-3.5-3.412 4.837-.703z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex w-[560px] shrink-0 items-center gap-6 rounded-2xl border border-[#E0E3E8] bg-white p-6 shadow-[0px_8px_24px_0px_rgba(0,35,102,0.08)]">
      {testimonial.photo.kind === "photo" ? (
        <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-2xl">
          <Image src={testimonial.photo.image} alt="" fill className="object-cover" />
        </div>
      ) : (
        <div className="flex h-[120px] w-[120px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-[#D2DFF6] bg-[#DBE8FF] p-3">
          <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#A8C7FA]">
            <span className="text-[22px] font-semibold tracking-[0.0455em] text-[#1E4A9E]">
              {testimonial.photo.code}
            </span>
          </div>
          <span className="w-24 text-center text-[11px] font-medium tracking-[0.1091em] text-[#535F71]">
            {testimonial.photo.label}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3">
        <StarRating />
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
  const loop = [...testimonials, ...testimonials];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame: number;
    const speed = 0.5;

    const step = () => {
      if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
        scroller.scrollLeft -= scroller.scrollWidth / 2;
      } else {
        scroller.scrollLeft += speed;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="flex flex-col gap-8 bg-white py-12 pl-4 sm:pl-8 lg:py-24 lg:pl-[120px]">
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold uppercase tracking-[0.1692em] text-[#0053E0]">
          Client Testimonials
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#121926] sm:text-[34px]">客戶肯定</h2>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-8 overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loop.map((testimonial, i) => (
          <TestimonialCard key={`${testimonial.id}-${i}`} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}
