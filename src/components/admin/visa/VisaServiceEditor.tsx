"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import ServiceItemsSection from "./ServiceItemsSection";
import {
  PASSPORT_FIELDS,
  VISA_FIELDS,
  createPassportItem,
  createVisaItem,
  fromEditableVisaServices,
  isSameVisaServices,
  normalizeVisaServices,
  toEditableVisaServices,
  type EditableVisaServices,
} from "./data";
import { useCmsDocument, usePutCmsDocument } from "@/lib/api/hooks/useCms";
import { ApiError } from "@/lib/api/client";
import type { VisaServices } from "@/lib/api/types/cms";

const CMS_KEY = "visa-services";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return "儲存失敗，請稍後再試";
}

export default function VisaServiceEditor() {
  const { data: doc, isLoading, isError } = useCmsDocument<VisaServices>(CMS_KEY);
  const putDocument = usePutCmsDocument<VisaServices>(CMS_KEY);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "warning" } | null>(
    null
  );

  // Reset the draft whenever a fresh server copy arrives (initial load, after save).
  const [syncedData, setSyncedData] = useState<VisaServices | null>(null);
  // Compared against the normalized copy, so fields the backend does not return yet don't count as edits.
  const [baseline, setBaseline] = useState<VisaServices | null>(null);
  const [draft, setDraft] = useState<EditableVisaServices | null>(null);
  if (doc && doc.data !== syncedData) {
    setSyncedData(doc.data);
    setBaseline(normalizeVisaServices(doc.data));
    setDraft(toEditableVisaServices(doc.data));
  }

  const isDirty =
    draft !== null &&
    baseline !== null &&
    !isSameVisaServices(fromEditableVisaServices(draft), baseline);

  const handleSave = () => {
    if (!draft) return;
    putDocument.mutate(fromEditableVisaServices(draft), {
      onSuccess: () => setToast({ message: "已儲存變更", variant: "success" }),
      onError: (err) => setToast({ message: errorMessage(err), variant: "warning" }),
    });
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="護照及簽證代辦服務"
        description="管理護照代辦與熱門國家簽證項目資料，並維護各項目「查看詳情」視窗中的所需文件內容。"
        onSave={handleSave}
        saveDisabled={!isDirty || putDocument.isPending}
      />

      {isLoading ? (
        <p className="text-sm text-[#535F71]">載入中…</p>
      ) : isError || !draft ? (
        <p className="text-sm text-red-600">代辦服務資料載入失敗，請重新整理頁面</p>
      ) : (
        <>
          <ServiceItemsSection
            title="護照代辦項目管理"
            description="管理護照代辦服務項目，前台將以表格顯示於「護照代辦」區塊；點擊項目後方「查看詳情」開啟的視窗內容也在此編輯。"
            managerTitle="項目列表"
            managerDescription="可個別開關顯示、編輯內容。"
            fields={PASSPORT_FIELDS}
            items={draft.passport_items}
            createItem={createPassportItem}
            onItemsChange={(passport_items) =>
              setDraft((prev) => (prev ? { ...prev, passport_items } : prev))
            }
          />

          <ServiceItemsSection
            title="熱門國家簽證項目管理"
            description="管理熱門國家簽證項目，前台將以表格顯示於「熱門國家簽證」區塊；費用／天數依規定不同。"
            managerTitle="項目列表"
            managerDescription="可個別開關顯示、編輯內容。"
            fields={VISA_FIELDS}
            items={draft.visa_items}
            createItem={createVisaItem}
            onItemsChange={(visa_items) => setDraft((prev) => (prev ? { ...prev, visa_items } : prev))}
          />
        </>
      )}

      {toast && (
        <AdminToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
