"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import JourneyCardsSection from "./JourneyCardsSection";
import { INITIAL_JOURNEY_CARDS, type JourneyCard } from "./data";

export default function JourneyShareEditor() {
  const [cards, setCards] = useState<JourneyCard[]>(INITIAL_JOURNEY_CARDS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saveCount, setSaveCount] = useState(0);

  const [isDirty, setIsDirty] = useState(false);
  useDirtyTracking(cards, setIsDirty, saveCount);

  const handleSave = () => {
    setToastMessage("已儲存變更");
    setSaveCount((count) => count + 1);
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="旅程分享"
        description="管理「最近的旅程」卡片內容，並維護每個旅程點擊後開啟的相簿相片與說明文字。"
        onSave={handleSave}
        saveDisabled={!isDirty}
      />

      <JourneyCardsSection items={cards} onItemsChange={setCards} />

      {toastMessage && <AdminToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
