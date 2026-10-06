"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import JourneyCardsSection from "./JourneyCardsSection";
import { isDraftValid, toJourneyCards, type JourneyCard } from "./data";
import { buildSaveOps, runSaveOps } from "./save";
import { ApiError } from "@/lib/api/client";
import {
  JOURNEY_EDITOR_KEY,
  fetchJourneyEditorData,
  useJourneyEditorData,
} from "@/lib/api/hooks/useJourneys";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return "請稍後再試";
}

export default function JourneyShareEditor() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useJourneyEditorData();
  const [toast, setToast] = useState<{ message: string; variant: "success" | "warning" } | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  // The save went out but reloading failed, so the page can't tell what was saved; block another save.
  const [reloadFailed, setReloadFailed] = useState(false);

  // Server copy (`base`) and the editable `draft`; a fresh server copy resets both (also after a save).
  const [syncedData, setSyncedData] = useState<typeof data>(undefined);
  const [base, setBase] = useState<JourneyCard[] | null>(null);
  const [draft, setDraft] = useState<JourneyCard[] | null>(null);
  if (data && data !== syncedData && !isSaving) {
    const fresh = toJourneyCards(data);
    setSyncedData(data);
    setBase(fresh);
    setDraft(fresh);
    setReloadFailed(false);
  }

  const pendingOps = base && draft ? buildSaveOps(base, draft) : [];
  const isDirty = pendingOps.length > 0;
  const isValid = draft !== null && isDraftValid(draft);

  const handleSave = async () => {
    if (!isDirty || !isValid) return;
    setIsSaving(true);
    const failures = await runSaveOps(pendingOps);

    let reloaded = false;
    try {
      const rows = await queryClient.fetchQuery({
        queryKey: JOURNEY_EDITOR_KEY,
        queryFn: fetchJourneyEditorData,
        staleTime: 0,
      });
      const fresh = toJourneyCards(rows);
      setSyncedData(rows);
      setBase(fresh);
      setDraft(fresh);
      reloaded = true;
    } catch {
      setReloadFailed(true);
    }
    setIsSaving(false);

    if (failures.length > 0) {
      setToast({
        message: `${failures.length} 項儲存失敗：${errorMessage(failures[0])}。${
          reloaded ? "畫面已更新為目前已儲存的內容，請重新修改後再儲存。" : "請重新整理頁面確認結果。"
        }`,
        variant: "warning",
      });
    } else {
      setToast({ message: "已儲存變更", variant: "success" });
    }
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="旅程分享"
        description="管理「最近的旅程」卡片內容，並維護每個旅程點擊後開啟的相簿相片與說明文字。"
        onSave={handleSave}
        saveDisabled={!isDirty || !isValid || isSaving || reloadFailed}
      />

      {isLoading ? (
        <p className="text-sm text-[#535F71]">載入中…</p>
      ) : isError || !draft ? (
        <p className="text-sm text-red-600">旅程分享資料載入失敗，請重新整理頁面</p>
      ) : (
        <>
          {reloadFailed && (
            <p className="text-sm font-medium text-[#D92D20]">
              已送出變更，但重新載入資料失敗，請重新整理頁面確認結果。
            </p>
          )}
          <JourneyCardsSection
            items={draft}
            onItemsChange={(updater) => setDraft((prev) => (prev ? updater(prev) : prev))}
          />
        </>
      )}

      {toast && (
        <AdminToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
