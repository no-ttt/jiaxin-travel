"use client";

import { useState } from "react";
import AdminSectionCard from "../ui/AdminSectionCard";
import AdminTextInput from "../ui/AdminTextInput";
import AdminTextarea from "../ui/AdminTextarea";
import AdminImageDropzone from "../ui/AdminImageDropzone";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import { HOMEPAGE_FEATURES, type FeatureCard } from "./data";

export default function FeatureSection({
  onDirtyChange,
  resetKey,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  resetKey?: unknown;
}) {
  const [features, setFeatures] = useState<FeatureCard[]>(HOMEPAGE_FEATURES);
  useDirtyTracking(features, onDirtyChange, resetKey);

  const updateFeature = (id: string, patch: Partial<FeatureCard>) => {
    setFeatures((prev) => prev.map((feature) => (feature.id === id ? { ...feature, ...patch } : feature)));
  };

  return (
    <AdminSectionCard
      title="品牌堅持三大特色"
      description="設定首頁「嘉新旅遊的堅持」區塊的三項特色圖示、標題與說明文字。"
    >
      <div className="flex flex-col gap-6 sm:flex-row">
        {features.map((feature) => (
          <div key={feature.id} className="flex flex-1 flex-col gap-3.5">
            <AdminImageDropzone label="上傳圖示" hint="SVG / PNG" size="sm" hintPosition="beside" />
            <AdminTextInput
              label="標題"
              value={feature.title}
              onChange={(value) => updateFeature(feature.id, { title: value })}
            />
            <AdminTextarea
              label="說明文字"
              value={feature.description}
              rows={4}
              onChange={(value) => updateFeature(feature.id, { description: value })}
            />
          </div>
        ))}
      </div>
    </AdminSectionCard>
  );
}
