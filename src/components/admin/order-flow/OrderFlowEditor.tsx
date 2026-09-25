"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import BankInfoSection from "./BankInfoSection";
import ReminderSection from "./ReminderSection";
import StepsSection from "./StepsSection";
import { INITIAL_BANK_INFO, INITIAL_REMINDER, INITIAL_STEPS, type BankInfo, type OrderFlowStep, type ReminderInfo } from "./data";

export default function OrderFlowEditor() {
  const [steps, setSteps] = useState<OrderFlowStep[]>(INITIAL_STEPS);
  const [bankInfo, setBankInfo] = useState<BankInfo>(INITIAL_BANK_INFO);
  const [reminder, setReminder] = useState<ReminderInfo>(INITIAL_REMINDER);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saveCount, setSaveCount] = useState(0);

  const [isDirty, setIsDirty] = useState(false);
  useDirtyTracking({ steps, bankInfo, reminder }, setIsDirty, saveCount);

  const handleSave = () => {
    setToastMessage("已儲存變更");
    setSaveCount((count) => count + 1);
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="訂購流程"
        description="編輯此頁面內容，包含流程步驟說明、匯款資訊與溫馨提醒。"
        onSave={handleSave}
        saveDisabled={!isDirty}
      />

      <StepsSection steps={steps} onStepsChange={setSteps} />

      <BankInfoSection info={bankInfo} onChange={(patch) => setBankInfo((prev) => ({ ...prev, ...patch }))} />

      <ReminderSection info={reminder} onChange={(patch) => setReminder((prev) => ({ ...prev, ...patch }))} />

      {toastMessage && <AdminToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
