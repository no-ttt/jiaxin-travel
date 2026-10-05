"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import ClausesSection from "./ClausesSection";
import PageIntroSection from "./PageIntroSection";
import {
  fromEditableFraudNotice,
  isSameFraudNotice,
  toEditableFraudNotice,
  type EditableFraudNotice,
  type FraudNoticeClause,
  type PageIntro,
} from "./data";
import { useCmsDocument, usePutCmsDocument } from "@/lib/api/hooks/useCms";
import { ApiError } from "@/lib/api/client";
import type { FraudNoticePage } from "@/lib/api/types/cms";

const CMS_KEY = "fraud-notice";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return "儲存失敗，請稍後再試";
}

export default function FraudNoticeEditor() {
  const { data: doc, isLoading, isError } = useCmsDocument<FraudNoticePage>(CMS_KEY);
  const putDocument = usePutCmsDocument<FraudNoticePage>(CMS_KEY);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "warning" } | null>(
    null
  );

  // Reset the draft whenever a fresh server copy arrives (initial load, after save).
  const [syncedData, setSyncedData] = useState<FraudNoticePage | null>(null);
  const [draft, setDraft] = useState<EditableFraudNotice | null>(null);
  if (doc && doc.data !== syncedData) {
    setSyncedData(doc.data);
    setDraft(toEditableFraudNotice(doc.data));
  }

  const isDirty =
    draft !== null &&
    syncedData !== null &&
    !isSameFraudNotice(fromEditableFraudNotice(draft, syncedData), syncedData);

  const handleSave = () => {
    if (!draft || !syncedData) return;
    putDocument.mutate(fromEditableFraudNotice(draft, syncedData), {
      onSuccess: () => setToast({ message: "已儲存變更", variant: "success" }),
      onError: (err) => setToast({ message: errorMessage(err), variant: "warning" }),
    });
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="防詐騙提醒說明"
        description="編輯此頁面內容，包含防詐騙提醒說明、常見詐騙手法與查證方式，對應前台「旅客須知及服務條款」防詐騙提醒說明頁籤。"
        onSave={handleSave}
        saveDisabled={!isDirty || putDocument.isPending}
      />

      {isLoading ? (
        <p className="text-sm text-[#535F71]">載入中…</p>
      ) : isError || !draft ? (
        <p className="text-sm text-red-600">防詐騙提醒資料載入失敗，請重新整理頁面</p>
      ) : (
        <>
          <PageIntroSection
            info={draft.pageIntro}
            onChange={(patch: Partial<PageIntro>) =>
              setDraft((prev) => (prev ? { ...prev, pageIntro: { ...prev.pageIntro, ...patch } } : prev))
            }
          />
          <ClausesSection
            clauses={draft.clauses}
            onClausesChange={(clauses: FraudNoticeClause[]) =>
              setDraft((prev) => (prev ? { ...prev, clauses } : prev))
            }
          />
        </>
      )}

      {toast && (
        <AdminToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
