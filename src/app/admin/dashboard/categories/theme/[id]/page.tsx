"use client";

import { use } from "react";
import ThemeCollectionEditor from "@/components/admin/theme-collection/ThemeCollectionEditor";

// The route segment is the theme's collection_id (see 產品分類設定 →「前往編輯內容」).
export default function AdminThemeCollectionPage({ params }: PageProps<"/admin/dashboard/categories/theme/[id]">) {
  const { id } = use(params);
  const collectionId = Number(id);
  if (!Number.isInteger(collectionId) || collectionId <= 0) {
    return <p className="text-sm text-red-600">找不到此主題集合頁</p>;
  }
  return <ThemeCollectionEditor collectionId={collectionId} />;
}
