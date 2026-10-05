"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import BankInfoSection from "./BankInfoSection";
import ReminderSection from "./ReminderSection";
import StepsSection from "./StepsSection";
import { fromEditableOrderFlow, isSameOrderFlow, toEditableOrderFlow, type EditableOrderFlow } from "./data";
import { useCmsDocument, usePutCmsDocument } from "@/lib/api/hooks/useCms";
import { ApiError } from "@/lib/api/client";
import type { PurchaseFlowPage } from "@/lib/api/types/cms";

const CMS_KEY = "purchase-flow";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return "儲存失敗，請稍後再試";
}

export default function OrderFlowEditor() {
  const { data: doc, isLoading, isError } = useCmsDocument<PurchaseFlowPage>(CMS_KEY);
  const putDocument = usePutCmsDocument<PurchaseFlowPage>(CMS_KEY);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "warning" } | null>(
    null
  );

  // Reset the draft whenever a fresh server copy arrives (initial load, after save).
  const [syncedData, setSyncedData] = useState<PurchaseFlowPage | null>(null);
  const [draft, setDraft] = useState<EditableOrderFlow | null>(null);
  if (doc && doc.data !== syncedData) {
    setSyncedData(doc.data);
    setDraft(toEditableOrderFlow(doc.data));
  }

  const isDirty =
    draft !== null &&
    syncedData !== null &&
    !isSameOrderFlow(fromEditableOrderFlow(draft, syncedData), syncedData);

  const updateSection =
    <K extends "bankInfo" | "reminder">(key: K) =>
    (patch: Partial<EditableOrderFlow[K]>) =>
      setDraft((prev) => (prev ? { ...prev, [key]: { ...prev[key], ...patch } } : prev));

  const handleSave = () => {
    if (!draft || !syncedData) return;
    putDocument.mutate(fromEditableOrderFlow(draft, syncedData), {
      onSuccess: () => setToast({ message: "已儲存變更", variant: "success" }),
      onError: (err) => setToast({ message: errorMessage(err), variant: "warning" }),
    });
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="訂購流程"
        description="編輯此頁面內容，包含流程步驟說明、匯款資訊與溫馨提醒。"
        onSave={handleSave}
        saveDisabled={!isDirty || putDocument.isPending}
      />

      {isLoading ? (
        <p className="text-sm text-[#535F71]">載入中…</p>
      ) : isError || !draft ? (
        <p className="text-sm text-red-600">訂購流程資料載入失敗，請重新整理頁面</p>
      ) : (
        <>
          <StepsSection
            steps={draft.steps}
            onStepsChange={(steps) => setDraft((prev) => (prev ? { ...prev, steps } : prev))}
          />
          <BankInfoSection info={draft.bankInfo} onChange={updateSection("bankInfo")} />
          <ReminderSection info={draft.reminder} onChange={updateSection("reminder")} />
        </>
      )}

      {toast && (
        <AdminToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
