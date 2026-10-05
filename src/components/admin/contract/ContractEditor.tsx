"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import ClausesSection from "./ClausesSection";
import DocumentSection from "./DocumentSection";
import PageIntroSection from "./PageIntroSection";
import { fromEditableContract, isSameContract, toEditableContract, type EditableContract } from "./data";
import { useCmsDocument, usePutCmsDocument } from "@/lib/api/hooks/useCms";
import { ApiError } from "@/lib/api/client";
import type { ContractPage } from "@/lib/api/types/cms";

const CMS_KEY = "contract";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return "儲存失敗，請稍後再試";
}

export default function ContractEditor() {
  const { data: doc, isLoading, isError } = useCmsDocument<ContractPage>(CMS_KEY);
  const putDocument = usePutCmsDocument<ContractPage>(CMS_KEY);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "warning" } | null>(
    null
  );

  // Reset the draft whenever a fresh server copy arrives (initial load, after save).
  const [syncedData, setSyncedData] = useState<ContractPage | null>(null);
  const [draft, setDraft] = useState<EditableContract | null>(null);
  if (doc && doc.data !== syncedData) {
    setSyncedData(doc.data);
    setDraft(toEditableContract(doc.data));
  }

  const isDirty =
    draft !== null &&
    syncedData !== null &&
    !isSameContract(fromEditableContract(draft, syncedData), syncedData);

  const updateSection =
    <K extends "pageIntro" | "contractDocument">(key: K) =>
    (patch: Partial<EditableContract[K]>) =>
      setDraft((prev) => (prev ? { ...prev, [key]: { ...prev[key], ...patch } } : prev));

  const handleSave = () => {
    if (!draft || !syncedData) return;
    putDocument.mutate(fromEditableContract(draft, syncedData), {
      onSuccess: () => setToast({ message: "已儲存變更", variant: "success" }),
      onError: (err) => setToast({ message: errorMessage(err), variant: "warning" }),
    });
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="旅遊契約書"
        description="編輯此頁面內容，包含契約書資訊、重要條款與相關連結。"
        onSave={handleSave}
        saveDisabled={!isDirty || putDocument.isPending}
      />

      {isLoading ? (
        <p className="text-sm text-[#535F71]">載入中…</p>
      ) : isError || !draft ? (
        <p className="text-sm text-red-600">旅遊契約書資料載入失敗，請重新整理頁面</p>
      ) : (
        <>
          <PageIntroSection info={draft.pageIntro} onChange={updateSection("pageIntro")} />
          <DocumentSection document={draft.contractDocument} onChange={updateSection("contractDocument")} />
          <ClausesSection
            clauses={draft.clauses}
            onClausesChange={(clauses) => setDraft((prev) => (prev ? { ...prev, clauses } : prev))}
          />
        </>
      )}

      {toast && (
        <AdminToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
