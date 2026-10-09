"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminConfirmDialog from "@/components/admin/ui/AdminConfirmDialog";
import AdminToast from "@/components/admin/ui/AdminToast";
import SidebarCategoriesSection from "@/components/admin/categories/SidebarCategoriesSection";
import RegionSubcategoriesSection from "@/components/admin/categories/RegionSubcategoriesSection";
import LuxurySubcategoriesSection from "@/components/admin/categories/LuxurySubcategoriesSection";
import ThemeSubcategoriesSection from "@/components/admin/categories/ThemeSubcategoriesSection";
import {
  isDraftValid,
  toCategoriesDraft,
  type CategoriesDraft,
} from "@/components/admin/categories/data";
import { buildSaveOps, runSaveOps } from "@/components/admin/categories/save";
import { ApiError } from "@/lib/api/client";
import { taxonomyApi } from "@/lib/api/endpoints/taxonomy";
import {
  TAXONOMY_KEY,
  useNavCategories,
  useRegions,
  useThemes,
} from "@/lib/api/hooks/useTaxonomy";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return "請稍後再試";
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const navCategories = useNavCategories();
  const regions = useRegions();
  const themes = useThemes();
  const [toast, setToast] = useState<{ message: string; variant: "success" | "warning" } | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  // API messages for changes it refused: removals (a region still tagged on trips) and duplicate names.
  const [refusedDialog, setRefusedDialog] = useState<{ title: string; message: string } | null>(null);
  // The save went out but reloading failed, so the page can't tell what was saved; block another save.
  const [reloadFailed, setReloadFailed] = useState(false);

  // Server copy (`base`) and the editable `draft`; a fresh server copy resets the draft (also after
  // a save: the page then shows what was actually saved). The serialized key (not object identity)
  // decides "fresh", so a save can set both at once.
  const serverKey =
    navCategories.data && regions.data && themes.data
      ? JSON.stringify([navCategories.data, regions.data, themes.data])
      : null;
  const [syncedKey, setSyncedKey] = useState<string | null>(null);
  const [base, setBase] = useState<CategoriesDraft | null>(null);
  const [draft, setDraft] = useState<CategoriesDraft | null>(null);
  if (serverKey !== null && serverKey !== syncedKey && !isSaving) {
    const fresh = toCategoriesDraft(navCategories.data!, regions.data!, themes.data!);
    setSyncedKey(serverKey);
    setBase(fresh);
    setDraft(fresh);
    setReloadFailed(false);
  }

  const pendingOps = base && draft ? buildSaveOps(base, draft) : [];
  const isDirty = pendingOps.length > 0;
  const isValid = draft !== null && isDraftValid(draft);

  const updateField =
    <K extends keyof CategoriesDraft>(key: K) =>
    (updater: (prev: CategoriesDraft[K]) => CategoriesDraft[K]) =>
      setDraft((prev) => (prev ? { ...prev, [key]: updater(prev[key]) } : prev));

  const handleSave = async () => {
    if (!isDirty || !isValid) return;
    setIsSaving(true);
    const failures = await runSaveOps(pendingOps);

    // Reload straight from the API (fetchQuery throws on failure, unlike reading the stale cache) and
    // show the server copy: whatever failed is simply not there, and the toast says so.
    let reloadedRegionIds: number[] | null = null;
    try {
      const [cats, regionRows, themeRows] = await Promise.all([
        queryClient.fetchQuery({ queryKey: ["taxonomy", "nav-categories"], queryFn: taxonomyApi.listNavCategories, staleTime: 0 }),
        queryClient.fetchQuery({ queryKey: ["taxonomy", "regions"], queryFn: taxonomyApi.listRegions, staleTime: 0 }),
        queryClient.fetchQuery({ queryKey: ["taxonomy", "themes"], queryFn: taxonomyApi.listThemes, staleTime: 0 }),
      ]);
      reloadedRegionIds = regionRows.map((region) => region.id);
      const fresh = toCategoriesDraft(cats, regionRows, themeRows);
      setSyncedKey(JSON.stringify([cats, regionRows, themeRows]));
      setBase(fresh);
      setDraft(fresh);
    } catch {
      setReloadFailed(true);
    }
    const reloaded = reloadedRegionIds !== null;
    // Other taxonomy lists (trip statuses, badges, the trip editor's options) refresh in the background.
    void queryClient.invalidateQueries({ queryKey: TAXONOMY_KEY });
    setIsSaving(false);

    // A removal that errored but whose region is gone after the reload did go through (only the
    // response was lost), so it counts as saved. The rest were refused: dialog with the API's message.
    const regionStillThere = (id: number) => reloadedRegionIds === null || reloadedRegionIds.includes(id);
    const refusedRemovals = failures.filter((f) => f.op.removed && regionStillThere(f.op.removed.id));
    const isDuplicateName = (f: (typeof failures)[number]) =>
      Boolean(f.op.named) && f.error instanceof ApiError && f.error.status === 409;
    const duplicateNames = failures.filter(isDuplicateName);
    const refused = [...refusedRemovals, ...duplicateNames];
    const retryable = failures.filter((f) => !f.op.removed && !isDuplicateName(f));
    const unsaved = refused.length + retryable.length;
    if (refused.length > 0) {
      const lines = [
        ...refusedRemovals.map((f) => `${f.op.removed!.label}：${errorMessage(f.error)}`),
        ...duplicateNames.map((f) => `${f.op.named!.label}：${errorMessage(f.error)}`),
      ].join("\n");
      const outcome = reloaded ? "" : "重新載入資料失敗，請重新整理頁面確認目前狀態。";
      const title =
        duplicateNames.length === 0 ? "無法刪除" : refusedRemovals.length === 0 ? "名稱已存在" : "部分變更無法儲存";
      setRefusedDialog({ title, message: `${lines}\n\n${outcome}` });
    }
    if (retryable.length > 0) {
      setToast({
        message: `${retryable.length} 項儲存失敗：${errorMessage(retryable[0].error)}。${
          reloaded ? "畫面已更新為目前已儲存的內容，請重新修改後再儲存。" : "請重新整理頁面確認結果。"
        }`,
        variant: "warning",
      });
    } else if (unsaved === 0) {
      setToast({ message: "已儲存變更", variant: "success" });
    } else if (refused.length < pendingOps.length) {
      setToast({ message: "其他變更已儲存", variant: "success" });
    }
  };

  const isLoading = navCategories.isLoading || regions.isLoading || themes.isLoading;
  const isError = navCategories.isError || regions.isError || themes.isError;

  return (
    <div className="flex flex-col gap-7">
      <AdminPageHeader
        title="產品分類設定"
        description="管理首頁側邊欄大分類、各分類的子選單開關，以及「國外團體」地區子分類與「主題旅遊」子類別的顯示名稱。"
        onSave={handleSave}
        saveDisabled={!isDirty || !isValid || isSaving || reloadFailed}
      />

      {isLoading ? (
        <p className="text-sm text-[#535F71]">載入中…</p>
      ) : isError || !draft ? (
        <p className="text-sm text-red-600">產品分類資料載入失敗，請重新整理頁面</p>
      ) : (
        <>
          {reloadFailed && (
            <p className="text-sm font-medium text-[#D92D20]">
              已送出變更，但重新載入資料失敗，請重新整理頁面確認結果。
            </p>
          )}
          {isDirty && !isValid && (
            <p className="text-sm font-medium text-[#D92D20]">有名稱未填、超過字數上限或重複，修正後才能儲存。</p>
          )}
          <SidebarCategoriesSection value={draft.categories} onChange={updateField("categories")} />
          <RegionSubcategoriesSection value={draft.regions} onChange={updateField("regions")} />
          <LuxurySubcategoriesSection />
          <ThemeSubcategoriesSection value={draft.themes} onChange={updateField("themes")} />
        </>
      )}

      {refusedDialog && (
        <AdminConfirmDialog
          title={refusedDialog.title}
          message={refusedDialog.message}
          confirmLabel="知道了"
          cancelLabel={null}
          onConfirm={() => setRefusedDialog(null)}
        />
      )}

      {toast && (
        <AdminToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
