"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import ClausesSection from "./ClausesSection";
import DocumentSection from "./DocumentSection";
import PageIntroSection from "./PageIntroSection";
import {
  INITIAL_CLAUSES,
  INITIAL_DOCUMENT,
  INITIAL_PAGE_INTRO,
  type ContractClause,
  type ContractDocument,
  type PageIntro,
} from "./data";

export default function ContractEditor() {
  const [pageIntro, setPageIntro] = useState<PageIntro>(INITIAL_PAGE_INTRO);
  const [contractDocument, setContractDocument] = useState<ContractDocument>(INITIAL_DOCUMENT);
  const [clauses, setClauses] = useState<ContractClause[]>(INITIAL_CLAUSES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saveCount, setSaveCount] = useState(0);

  const [isDirty, setIsDirty] = useState(false);
  useDirtyTracking({ pageIntro, contractDocument, clauses }, setIsDirty, saveCount);

  const handleSave = () => {
    setToastMessage("已儲存變更");
    setSaveCount((count) => count + 1);
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="旅遊契約書"
        description="編輯此頁面內容，包含契約書資訊、重要條款與相關連結。"
        onSave={handleSave}
        saveDisabled={!isDirty}
      />

      <PageIntroSection info={pageIntro} onChange={(patch) => setPageIntro((prev) => ({ ...prev, ...patch }))} />

      <DocumentSection
        document={contractDocument}
        onChange={(patch) => setContractDocument((prev) => ({ ...prev, ...patch }))}
      />

      <ClausesSection clauses={clauses} onClausesChange={setClauses} />

      {toastMessage && <AdminToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
