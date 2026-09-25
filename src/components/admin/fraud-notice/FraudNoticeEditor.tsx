"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import ClausesSection from "./ClausesSection";
import PageIntroSection from "./PageIntroSection";
import { INITIAL_CLAUSES, INITIAL_PAGE_INTRO, type FraudNoticeClause, type PageIntro } from "./data";

export default function FraudNoticeEditor() {
  const [pageIntro, setPageIntro] = useState<PageIntro>(INITIAL_PAGE_INTRO);
  const [clauses, setClauses] = useState<FraudNoticeClause[]>(INITIAL_CLAUSES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saveCount, setSaveCount] = useState(0);

  const [isDirty, setIsDirty] = useState(false);
  useDirtyTracking({ pageIntro, clauses }, setIsDirty, saveCount);

  const handleSave = () => {
    setToastMessage("已儲存變更");
    setSaveCount((count) => count + 1);
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="防詐騙提醒說明"
        description="編輯此頁面內容，包含防詐騙提醒說明、常見詐騙手法與查證方式，對應前台「旅客須知及服務條款」防詐騙提醒說明頁籤。"
        onSave={handleSave}
        saveDisabled={!isDirty}
      />

      <PageIntroSection info={pageIntro} onChange={(patch) => setPageIntro((prev) => ({ ...prev, ...patch }))} />

      <ClausesSection clauses={clauses} onClausesChange={setClauses} />

      {toastMessage && <AdminToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
