"use client";

import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import BrandInfoSection from "./BrandInfoSection";
import ContactInfoSection from "./ContactInfoSection";
import CopyrightSection from "./CopyrightSection";
import {
  INITIAL_BRAND_INFO,
  INITIAL_CONTACT_INFO,
  INITIAL_COPYRIGHT_INFO,
  type BrandInfo,
  type ContactInfo,
  type CopyrightInfo,
} from "./data";

export default function FooterEditor() {
  const [brandInfo, setBrandInfo] = useState<BrandInfo>(INITIAL_BRAND_INFO);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(INITIAL_CONTACT_INFO);
  const [copyrightInfo, setCopyrightInfo] = useState<CopyrightInfo>(INITIAL_COPYRIGHT_INFO);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saveCount, setSaveCount] = useState(0);

  const [isDirty, setIsDirty] = useState(false);
  useDirtyTracking({ brandInfo, contactInfo, copyrightInfo }, setIsDirty, saveCount);

  const handleSave = () => {
    setToastMessage("已儲存變更");
    setSaveCount((count) => count + 1);
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        title="網站頁尾設定"
        description="管理網站頁尾（Footer）顯示的品牌資訊、聯絡方式、社群連結與版權宣告文字，套用至所有前台頁面。"
        onSave={handleSave}
        saveDisabled={!isDirty}
      />

      <BrandInfoSection info={brandInfo} onChange={(patch) => setBrandInfo((prev) => ({ ...prev, ...patch }))} />

      <ContactInfoSection
        info={contactInfo}
        onChange={(patch) => setContactInfo((prev) => ({ ...prev, ...patch }))}
      />

      <CopyrightSection
        info={copyrightInfo}
        onChange={(patch) => setCopyrightInfo((prev) => ({ ...prev, ...patch }))}
      />

      {toastMessage && <AdminToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
