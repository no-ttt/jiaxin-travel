"use client";

import AdminSectionCard from "../ui/AdminSectionCard";
import AdminTextInput from "../ui/AdminTextInput";
import AdminTextarea from "../ui/AdminTextarea";
import AdminImageDropzone from "../ui/AdminImageDropzone";
import type { FeatureCard } from "./data";

export default function FeatureSection({
  value: features,
  onChange: setFeatures,
}: {
  value: FeatureCard[];
  onChange: (updater: (prev: FeatureCard[]) => FeatureCard[]) => void;
}) {
  const updateFeature = (id: string, patch: Partial<FeatureCard>) => {
    setFeatures((prev) => prev.map((feature) => (feature._id === id ? { ...feature, ...patch } : feature)));
  };

  return (
    <AdminSectionCard
      title="品牌堅持三大特色"
      description="設定首頁「嘉新旅遊的堅持」區塊的三項特色圖示、標題與說明文字。"
    >
      <div className="flex flex-col gap-6 sm:flex-row">
        {features.map((feature) => (
          <div key={feature._id} className="flex flex-1 flex-col gap-3.5">
            <AdminImageDropzone
              label="上傳圖示"
              hint="SVG / PNG"
              size="sm"
              hintPosition="beside"
              purpose="icon"
              accept="image/svg+xml,image/png"
              mediaId={feature.icon_media_id}
              onChange={(icon_media_id) => updateFeature(feature._id, { icon_media_id })}
            />
            <AdminTextInput
              label="標題"
              value={feature.title}
              onChange={(value) => updateFeature(feature._id, { title: value })}
            />
            <AdminTextarea
              label="說明文字"
              value={feature.description}
              rows={4}
              onChange={(value) => updateFeature(feature._id, { description: value })}
            />
          </div>
        ))}
      </div>
    </AdminSectionCard>
  );
}
