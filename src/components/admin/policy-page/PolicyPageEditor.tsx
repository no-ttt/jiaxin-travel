"use client";

import { AdminLoading } from "@/components/admin/ui/AdminSpinner";
import { useUnsavedChangesWarning } from "@/components/admin/unsaved/UnsavedChangesProvider";
import { usePreviewWriter } from "@/components/admin/preview/draft-store";
import { useState } from "react";
import AdminPageHeader from "../AdminPageHeader";
import AdminToast from "../ui/AdminToast";
import PolicyIntroSection from "./PolicyIntroSection";
import PolicySectionsSection from "./PolicySectionsSection";
import {
  fromEditablePolicyPage,
  isSamePolicyPage,
  normalizePolicyPage,
  toEditablePolicyPage,
  type EditablePolicyPage,
} from "./data";
import { useCmsDocument, usePutCmsDocument } from "@/lib/api/hooks/useCms";
import { ApiError } from "@/lib/api/client";
import type { PolicyPage } from "@/lib/api/types/cms";

/** Per-page copy: both pages share the layout (title + intro + sections) from the design. */
export type PolicyPageConfig = {
  cmsKey: "cancellation-policy" | "announcements";
  /** Page title, also the 旅客須知 tab name. */
  label: string;
  description: string;
  sectionsTitle: string;
  sectionsDescription: string;
};

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = (err.detail as { error?: { message?: string } } | undefined)?.error?.message;
    if (message) return message;
  }
  return "儲存失敗，請稍後再試";
}

export default function PolicyPageEditor({ config }: { config: PolicyPageConfig }) {
  const { data: doc, isError } = useCmsDocument<PolicyPage>(config.cmsKey);
  const putDocument = usePutCmsDocument<PolicyPage>(config.cmsKey);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "warning" } | null>(null);

  // Reset the draft whenever a fresh server copy arrives (initial load, after save).
  const [syncedData, setSyncedData] = useState<PolicyPage | null>(null);
  const [draft, setDraft] = useState<EditablePolicyPage | null>(null);
  if (doc && doc.data !== syncedData) {
    setSyncedData(doc.data);
    setDraft(toEditablePolicyPage(doc.data));
  }

  const isDirty =
    draft !== null &&
    syncedData !== null &&
    !isSamePolicyPage(fromEditablePolicyPage(draft), normalizePolicyPage(syncedData));
  useUnsavedChangesWarning(isDirty);
  const openPreview = usePreviewWriter(config.cmsKey, draft, (d) => fromEditablePolicyPage(d));

  const handleSave = () => {
    if (!draft) return;
    putDocument.mutate(fromEditablePolicyPage(draft), {
      onSuccess: () => setToast({ message: "已儲存變更", variant: "success" }),
      onError: (err) => setToast({ message: errorMessage(err), variant: "warning" }),
    });
  };

  return (
    <div className="flex w-full flex-col gap-7">
      <AdminPageHeader
        onPreview={openPreview}
        title={config.label}
        description={config.description}
        onSave={handleSave}
        saveDisabled={!isDirty || putDocument.isPending}
      />

      {!draft && !isError ? (
        <AdminLoading />
      ) : !draft ? (
        <p className="text-sm text-red-600">{config.label}資料載入失敗，請重新整理頁面</p>
      ) : (
        <>
          <PolicyIntroSection
            tabLabel={config.label}
            intro={draft.intro}
            onChange={(patch) =>
              setDraft((prev) => (prev ? { ...prev, intro: { ...prev.intro, ...patch } } : prev))
            }
          />
          <PolicySectionsSection
            title={config.sectionsTitle}
            description={config.sectionsDescription}
            sections={draft.sections}
            onChange={(sections) => setDraft((prev) => (prev ? { ...prev, sections } : prev))}
          />
        </>
      )}

      {toast && <AdminToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}
    </div>
  );
}
