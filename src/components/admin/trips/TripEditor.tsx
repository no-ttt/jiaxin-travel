"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EDITOR_STEPS, type EditorStepKey } from "./editor-steps";
import EditorStepRail from "./EditorStepRail";
import CoverSection from "./CoverSection";
import BasicInfoSection from "./BasicInfoSection";
import HighlightsSection from "./HighlightsSection";
import FlightSection from "./FlightSection";
import ItinerarySection from "./ItinerarySection";
import PurchaseNoticeSection from "./PurchaseNoticeSection";

export default function TripEditor({ tripId }: { tripId: string }) {
  const [activeStep, setActiveStep] = useState<EditorStepKey>("cover");
  const [departDate, setDepartDate] = useState("2027-01-13");
  const isClickScrolling = useRef(false);
  void tripId;

  useEffect(() => {
    const sections = EDITOR_STEPS.map((step) => document.getElementById(step.key)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const key = visible[0].target.id as EditorStepKey;
          setActiveStep(key);
        }
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleSelectStep = (step: EditorStepKey) => {
    setActiveStep(step);
    const target = document.getElementById(step);
    if (!target) return;
    isClickScrolling.current = true;
    const top = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
    window.setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[3px]">
          <Link
            href="/admin/dashboard/trips"
            className="text-[13px] font-medium leading-[1.45em] text-[#535F71] hover:text-[#0053E0]"
          >
            行程產品管理
          </Link>
          <h1 className="text-[28px] font-bold leading-[1.45em] text-[#090909]">行程頁資料</h1>
          <p className="text-sm font-medium leading-[1.45em] text-[#535F71]">
            依序填寫行程內容，完成後可預覽。
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            className="flex h-10 w-[92px] cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] bg-white text-sm font-bold leading-[1.45em] text-[#090909] transition hover:bg-[#F6F6F6]"
          >
            預覽
          </button>
          <button
            type="button"
            className="flex h-10 w-[126px] cursor-pointer items-center justify-center rounded-xl bg-[#0053E0] text-sm font-bold leading-[1.45em] text-white transition hover:bg-[#0047BE]"
          >
            儲存變更
          </button>
        </div>
      </div>

      <div className="sticky top-9 z-30">
        <EditorStepRail activeStep={activeStep} onSelect={handleSelectStep} />
      </div>

      <div className="flex flex-col gap-5">
        {EDITOR_STEPS.map((step) => (
          <div key={step.key} id={step.key} className="scroll-mt-[100px]">
            {step.key === "cover" ? (
              <CoverSection title={step.title} description={step.description} />
            ) : step.key === "basic" ? (
              <BasicInfoSection
                title={step.title}
                description={step.description}
                departDate={departDate}
                onDepartDateChange={setDepartDate}
              />
            ) : step.key === "highlights" ? (
              <HighlightsSection title={step.title} description={step.description} />
            ) : step.key === "flights" ? (
              <FlightSection title={step.title} description={step.description} />
            ) : step.key === "itinerary" ? (
              <ItinerarySection title={step.title} description={step.description} startDate={departDate} />
            ) : (
              <PurchaseNoticeSection title={step.title} description={step.description} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
