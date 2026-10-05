"use client";

import AdminSectionCard from "../ui/AdminSectionCard";
import AdminItemCard from "../ui/AdminItemCard";
import AdminTextInput from "../ui/AdminTextInput";
import AdminTextarea from "../ui/AdminTextarea";
import AdminAddButton from "../ui/AdminAddButton";
import { generateId } from "../ui/generateId";
import AdminSelect from "../trips/AdminSelect";
import type { TestimonialItem } from "./data";

/** The backend rejects more than 12 testimonials (422 "List should have at most 12 items"). */
const MAX_TESTIMONIALS = 12;

const RATING_OPTIONS = [5, 4, 3, 2, 1].map((rating) => ({
  rating,
  label: `${"★".repeat(rating)}（${rating}）`,
}));

export default function TestimonialSection({
  value: testimonials,
  onChange: setTestimonials,
}: {
  value: TestimonialItem[];
  onChange: (updater: (prev: TestimonialItem[]) => TestimonialItem[]) => void;
}) {
  const updateTestimonial = (id: string, patch: Partial<TestimonialItem>) => {
    setTestimonials((prev) => prev.map((item) => (item._id === id ? { ...item, ...patch } : item)));
  };

  const addTestimonial = () => {
    setTestimonials((prev) => [
      ...prev,
      {
        _id: generateId("testimonial"),
        name: "",
        trip_info: "",
        rating: 5,
        content: "",
        photo_media_id: null,
      },
    ]);
  };

  const duplicateTestimonial = (index: number) => {
    setTestimonials((prev) => {
      const target = prev[index];
      const copy: TestimonialItem = { ...target, _id: generateId("testimonial") };
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
    });
  };

  const removeTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <AdminSectionCard
      title="客戶好評"
      description="設定首頁「客戶肯定」區塊顯示的評價卡片，可新增、刪除與排序，建議 4～8 則。"
    >
      {testimonials.map((item, index) => (
        <AdminItemCard
          key={item._id}
          badge={`評價 ${index + 1}`}
          actions={[
            { label: "複製", onClick: () => duplicateTestimonial(index) },
            { label: "刪除", onClick: () => removeTestimonial(item._id) },
          ]}
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <AdminTextInput
                label="姓名"
                value={item.name}
                onChange={(value) => updateTestimonial(item._id, { name: value })}
              />
            </div>
            <div className="flex-1">
              <AdminTextInput
                label="行程資訊（地點｜日期）"
                value={item.trip_info}
                onChange={(value) => updateTestimonial(item._id, { trip_info: value })}
              />
            </div>
            <div className="flex w-[168px] shrink-0 flex-col gap-[7px]">
              <span className="text-sm font-bold leading-[1.45em] text-[#535F71]">評分</span>
              <AdminSelect
                size="field"
                ariaLabel="評分"
                options={RATING_OPTIONS.map((option) => option.label)}
                value={RATING_OPTIONS.find((option) => option.rating === item.rating)?.label ?? ""}
                onChange={(label) => {
                  const rating = RATING_OPTIONS.find((option) => option.label === label)?.rating;
                  if (rating) updateTestimonial(item._id, { rating });
                }}
              />
            </div>
          </div>
          <AdminTextarea
            label="評價內容"
            value={item.content}
            rows={2}
            onChange={(value) => updateTestimonial(item._id, { content: value })}
          />
        </AdminItemCard>
      ))}
      <AdminAddButton
        label="新增好評"
        onClick={addTestimonial}
        disabled={testimonials.length >= MAX_TESTIMONIALS}
        title={testimonials.length >= MAX_TESTIMONIALS ? `最多 ${MAX_TESTIMONIALS} 則好評，請先刪除一則` : undefined}
      />
    </AdminSectionCard>
  );
}
