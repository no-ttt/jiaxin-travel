"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import ServiceItemsSection from "./ServiceItemsSection";
import { INITIAL_PASSPORT_ITEMS, INITIAL_VISA_ITEMS, type ServiceItem } from "./data";

export default function VisaServiceEditor() {
  const [passportItems, setPassportItems] = useState<ServiceItem[]>(INITIAL_PASSPORT_ITEMS);
  const [visaItems, setVisaItems] = useState<ServiceItem[]>(INITIAL_VISA_ITEMS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saveCount, setSaveCount] = useState(0);

  const [passportDirty, setPassportDirty] = useState(false);
  const [visaDirty, setVisaDirty] = useState(false);
  useDirtyTracking(passportItems, setPassportDirty, saveCount);
  useDirtyTracking(visaItems, setVisaDirty, saveCount);
  const isDirty = passportDirty || visaDirty;

  const handleSave = () => {
    setToastMessage("已儲存變更");
    setSaveCount((count) => count + 1);
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="護照及簽證代辦服務"
        description="管理護照代辦與熱門國家簽證項目資料，並維護各項目「查看詳情」視窗中的所需文件內容。"
        onSave={handleSave}
        saveDisabled={!isDirty}
      />

      <ServiceItemsSection
        title="護照代辦項目管理"
        description="管理護照代辦服務項目，前台將以表格顯示於「護照代辦」區塊；點擊項目後方「查看詳情」開啟的視窗內容也在此編輯。"
        managerTitle="項目列表"
        managerDescription="固定 5 個護照代辦項目，可個別開關顯示、編輯內容。"
        items={passportItems}
        onItemsChange={setPassportItems}
      />

      <ServiceItemsSection
        title="熱門國家簽證項目管理"
        description="管理熱門國家簽證項目，前台將以表格顯示於「熱門國家簽證」區塊；費用／天數依規定不同。"
        managerTitle="項目列表"
        managerDescription="固定 9 個熱門國家簽證項目，可個別開關顯示、編輯內容。"
        items={visaItems}
        onItemsChange={setVisaItems}
      />

      {toastMessage && <AdminToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
