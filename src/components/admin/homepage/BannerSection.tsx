"use client";

import AdminSectionCard from "../ui/AdminSectionCard";
import AdminItemCard from "../ui/AdminItemCard";
import AdminTextInput from "../ui/AdminTextInput";
import AdminImageDropzone from "../ui/AdminImageDropzone";
import AdminAddButton from "../ui/AdminAddButton";
import { generateId } from "../ui/generateId";
import type { BannerItem } from "./data";

export default function BannerSection({
  value: banners,
  onChange: setBanners,
}: {
  value: BannerItem[];
  onChange: (updater: (prev: BannerItem[]) => BannerItem[]) => void;
}) {
  const updateBanner = (id: string, patch: Partial<BannerItem>) => {
    setBanners((prev) => prev.map((banner) => (banner._id === id ? { ...banner, ...patch } : banner)));
  };

  const addBanner = () => {
    setBanners((prev) => [
      ...prev,
      {
        _id: generateId("banner"),
        title: "",
        subtitle: "",
        media_id: null,
        link_url: "",
        open_in_new_tab: false,
      },
    ]);
  };

  const duplicateBanner = (index: number) => {
    setBanners((prev) => {
      const target = prev[index];
      const copy: BannerItem = { ...target, _id: generateId("banner") };
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
    setBanners((prev) => prev.filter((banner) => banner._id !== id));
  };

  return (
    <AdminSectionCard title="首頁 Banner 輪播">
      {banners.map((banner, index) => (
        <AdminItemCard
          key={banner._id}
          badge={`Banner ${index + 1}`}
          actions={[
            { label: "複製", onClick: () => duplicateBanner(index) },
            { label: "上移", onClick: () => moveBannerUp(index), disabled: index === 0 },
            { label: "刪除", onClick: () => removeBanner(banner._id) },
          ]}
        >
          <AdminTextInput
            label="主標題"
            value={banner.title}
            onChange={(value) => updateBanner(banner._id, { title: value })}
          />
          <AdminTextInput
            label="副標題"
            value={banner.subtitle}
            onChange={(value) => updateBanner(banner._id, { subtitle: value })}
          />
          <AdminTextInput
            label="連結網址"
            value={banner.link_url}
            onChange={(value) => updateBanner(banner._id, { link_url: value })}
          />
          <AdminImageDropzone
            fieldLabel="背景圖片"
            label="新增圖片"
            mediaId={banner.media_id}
            onChange={(mediaId) => updateBanner(banner._id, { media_id: mediaId })}
          />
        </AdminItemCard>
      ))}
      <AdminAddButton label="新增橫幅" onClick={addBanner} />
    </AdminSectionCard>
  );
}
