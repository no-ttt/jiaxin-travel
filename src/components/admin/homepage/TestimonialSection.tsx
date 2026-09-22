"use client";

import { useState } from "react";
import AdminSectionCard from "../ui/AdminSectionCard";
import AdminItemCard from "../ui/AdminItemCard";
import AdminTextInput from "../ui/AdminTextInput";
import AdminTextarea from "../ui/AdminTextarea";
import AdminAddButton from "../ui/AdminAddButton";
import { generateId } from "../ui/generateId";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import { INITIAL_HOMEPAGE_TESTIMONIALS, type TestimonialItem } from "./data";

export default function TestimonialSection({
  onDirtyChange,
  resetKey,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  resetKey?: unknown;
}) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_HOMEPAGE_TESTIMONIALS);
  useDirtyTracking(testimonials, onDirtyChange, resetKey);

  const updateTestimonial = (id: string, patch: Partial<TestimonialItem>) => {
    setTestimonials((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addTestimonial = () => {
    setTestimonials((prev) => [
      ...prev,
      { id: generateId("testimonial"), name: "", tripInfo: "", rating: 5, content: "" },
    ]);
  };

  const duplicateTestimonial = (index: number) => {
    setTestimonials((prev) => {
      const target = prev[index];
      const copy: TestimonialItem = { ...target, id: generateId("testimonial") };
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
    });
  };

  const removeTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AdminSectionCard
      title="客戶好評"
      description="設定首頁「客戶肯定」區塊顯示的評價卡片，可新增、刪除與排序，建議 4～8 則。"
    >
      {testimonials.map((item, index) => (
        <AdminItemCard
          key={item.id}
          badge={`評價 ${index + 1}`}
          actions={[
            { label: "複製", onClick: () => duplicateTestimonial(index) },
            { label: "刪除", onClick: () => removeTestimonial(item.id) },
          ]}
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <AdminTextInput
                label="姓名"
                value={item.name}
                onChange={(value) => updateTestimonial(item.id, { name: value })}
              />
            </div>
            <div className="flex-1">
              <AdminTextInput
                label="行程資訊（地點｜日期）"
                value={item.tripInfo}
                onChange={(value) => updateTestimonial(item.id, { tripInfo: value })}
              />
            </div>
            <div className="w-[140px] shrink-0">
              <AdminTextInput
                label="評分"
                value={`${"★".repeat(item.rating)}（${item.rating}）`}
                onChange={() => {}}
              />
            </div>
          </div>
          <AdminTextarea
            label="評價內容"
            value={item.content}
            rows={2}
            onChange={(value) => updateTestimonial(item.id, { content: value })}
          />
        </AdminItemCard>
      ))}
      <AdminAddButton label="新增好評" onClick={addTestimonial} />
    </AdminSectionCard>
  );
}
