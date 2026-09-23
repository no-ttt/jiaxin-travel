"use client";

import { use } from "react";
import ThemeCollectionEditor from "@/components/admin/theme-collection/ThemeCollectionEditor";

export default function AdminThemeCollectionPage({ params }: PageProps<"/admin/dashboard/categories/theme/[id]">) {
  const { id } = use(params);
  return <ThemeCollectionEditor themeId={id} />;
}
