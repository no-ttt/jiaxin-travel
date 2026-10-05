"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import BrandInfoSection from "./BrandInfoSection";
import ContactInfoSection from "./ContactInfoSection";
import CopyrightSection from "./CopyrightSection";
import { fromEditableFooter, isSameFooter, toEditableFooter, type EditableFooter } from "./data";
import { useCmsDocument, usePutCmsDocument } from "@/lib/api/hooks/useCms";
import { ApiError } from "@/lib/api/client";
import type { FooterDoc } from "@/lib/api/types/cms";

const CMS_KEY = "footer";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return "儲存失敗，請稍後再試";
}

export default function FooterEditor() {
  const { data: doc, isLoading, isError } = useCmsDocument<FooterDoc>(CMS_KEY);
  const putDocument = usePutCmsDocument<FooterDoc>(CMS_KEY);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "warning" } | null>(
    null
  );

  // Reset the draft whenever a fresh server copy arrives (initial load, after save).
  const [syncedData, setSyncedData] = useState<FooterDoc | null>(null);
  // The server copy as the editor would save it untouched (e.g. "" URLs become null), for dirty checks.
  const [baseline, setBaseline] = useState<FooterDoc | null>(null);
  const [draft, setDraft] = useState<EditableFooter | null>(null);
  if (doc && doc.data !== syncedData) {
    setSyncedData(doc.data);
    setBaseline(fromEditableFooter(toEditableFooter(doc.data), doc.data));
    setDraft(toEditableFooter(doc.data));
  }

  const isDirty =
    draft !== null &&
    syncedData !== null &&
    baseline !== null &&
    !isSameFooter(fromEditableFooter(draft, syncedData), baseline);

  const updateSection =
    <K extends keyof EditableFooter>(key: K) =>
    (patch: Partial<EditableFooter[K]>) =>
      setDraft((prev) => (prev ? { ...prev, [key]: { ...prev[key], ...patch } } : prev));

  const handleSave = () => {
    if (!draft || !syncedData) return;
    putDocument.mutate(fromEditableFooter(draft, syncedData), {
      onSuccess: () => setToast({ message: "已儲存變更", variant: "success" }),
      onError: (err) => setToast({ message: errorMessage(err), variant: "warning" }),
    });
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="網站頁尾設定"
        description="管理網站頁尾（Footer）顯示的品牌資訊、聯絡方式、社群連結與版權宣告文字，套用至所有前台頁面。"
        onSave={handleSave}
        saveDisabled={!isDirty || putDocument.isPending}
      />

      {isLoading ? (
        <p className="text-sm text-[#535F71]">載入中…</p>
      ) : isError || !draft ? (
        <p className="text-sm text-red-600">頁尾資料載入失敗，請重新整理頁面</p>
      ) : (
        <>
          <BrandInfoSection info={draft.brandInfo} onChange={updateSection("brandInfo")} />
          <ContactInfoSection info={draft.contactInfo} onChange={updateSection("contactInfo")} />
          <CopyrightSection info={draft.copyrightInfo} onChange={updateSection("copyrightInfo")} />
        </>
      )}

      {toast && (
        <AdminToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
