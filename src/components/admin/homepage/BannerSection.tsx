"use client";

import { useState } from "react";
import AdminSectionCard from "../ui/AdminSectionCard";
import AdminItemCard from "../ui/AdminItemCard";
import AdminTextInput from "../ui/AdminTextInput";
import AdminImageDropzone from "../ui/AdminImageDropzone";
import AdminAddButton from "../ui/AdminAddButton";
import { generateId } from "../ui/generateId";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import { INITIAL_HOMEPAGE_BANNERS, type BannerItem } from "./data";

export default function BannerSection({
  onDirtyChange,
  resetKey,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  resetKey?: unknown;
}) {
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_HOMEPAGE_BANNERS);
  useDirtyTracking(banners, onDirtyChange, resetKey);

  const updateBanner = (id: string, patch: Partial<BannerItem>) => {
    setBanners((prev) => prev.map((banner) => (banner.id === id ? { ...banner, ...patch } : banner)));
  };

  const addBanner = () => {
    setBanners((prev) => [
      ...prev,
      { id: generateId("banner"), title: "", subtitle: "", linkUrl: "" },
    ]);
  };

  const duplicateBanner = (index: number) => {
    setBanners((prev) => {
      const target = prev[index];
      const copy: BannerItem = { ...target, id: generateId("banner") };
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
    });
  };

  const moveBannerUp = (index: number) => {
    if (index === 0) return;
    setBanners((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const removeBanner = (id: string) => {
    setBanners((prev) => prev.filter((banner) => banner.id !== id));
  };

  return (
    <AdminSectionCard title="首頁 Banner 輪播">
      {banners.map((banner, index) => (
        <AdminItemCard
          key={banner.id}
          badge={`Banner ${index + 1}`}
          actions={[
            { label: "複製", onClick: () => duplicateBanner(index) },
            { label: "上移", onClick: () => moveBannerUp(index), disabled: index === 0 },
            { label: "刪除", onClick: () => removeBanner(banner.id) },
          ]}
        >
          <AdminTextInput
            label="主標題"
            value={banner.title}
            onChange={(value) => updateBanner(banner.id, { title: value })}
          />
          <AdminTextInput
            label="副標題"
            value={banner.subtitle}
            onChange={(value) => updateBanner(banner.id, { subtitle: value })}
          />
          <AdminTextInput
            label="連結網址"
            value={banner.linkUrl}
            onChange={(value) => updateBanner(banner.id, { linkUrl: value })}
          />
          <AdminImageDropzone fieldLabel="背景圖片" label="新增圖片" />
        </AdminItemCard>
      ))}
      <AdminAddButton label="新增橫幅" onClick={addBanner} />
    </AdminSectionCard>
  );
}
