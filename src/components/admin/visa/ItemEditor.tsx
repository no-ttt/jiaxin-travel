"use client";

import { useState } from "react";
import AdminTextInput from "../ui/AdminTextInput";
import ToggleSwitch from "../ui/ToggleSwitch";
import DrawerTabEditor, { DRAWER_TABS, type DrawerTabKey } from "./DrawerTabEditor";
import type { EditableDetail, EditableServiceItem, FieldConfig } from "./data";

const VISIBLE_KEYS: Record<DrawerTabKey, "required_docs_visible" | "notice_visible" | "downloads_visible"> = {
  documents: "required_docs_visible",
  notice: "notice_visible",
  downloads: "downloads_visible",
};

export default function ItemEditor<T extends EditableServiceItem>({
  item,
  index,
  fields,
  onChange,
  onDelete,
}: {
  item: T;
  index: number;
  fields: FieldConfig<T>;
  onChange: (patch: Partial<T>) => void;
  onDelete?: () => void;
}) {
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTabKey>("documents");

  const updateDetail = (patch: Partial<EditableDetail>) => {
    onChange({ detail: { ...item.detail, ...patch } } as Partial<T>);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#E0E3E8] bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-bold leading-[1.45em] text-[#090909]">
          目前編輯：項目 {index + 1}（{item.name || "未命名項目"}）
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs leading-[1.45em] text-[#535F71]">切換上方項目即可編輯其他內容</span>
          {onDelete && (
            <>
              <span className="text-xs leading-[1.45em] text-[#535F71] opacity-50">｜</span>
              <button
                type="button"
                onClick={onDelete}
                className="cursor-pointer text-xs leading-[1.45em] text-[#535F71] hover:text-[#C71A1A]"
              >
                刪除此項目
              </button>
            </>
          )}
        </div>
      </div>

      <AdminTextInput label="項目名稱" value={item.name} onChange={(name) => onChange({ name } as Partial<T>)} />

      <div className="grid grid-cols-3 gap-4">
        {fields.map((field) => (
          <AdminTextInput
            key={field.key}
            label={field.label}
            value={String(item[field.key] ?? "")}
            onChange={(value) => onChange({ [field.key]: value } as Partial<T>)}
          />
        ))}
      </div>

      <div className="h-px w-full bg-[#E0E3E8]" />

      <span className="text-lg font-bold leading-[1.5em] text-[#090909]">查看詳情 視窗內容</span>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-bold leading-[1.45em] text-[#090909]">視窗頁籤</span>
          <span className="text-xs leading-[1.45em] text-[#535F71]">固定 3 個頁籤，對應視窗內的分頁內容。</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DRAWER_TABS.map((tab) => {
            const active = tab.key === activeDrawerTab;
            const visibleKey = VISIBLE_KEYS[tab.key];
            return (
              <div
                key={tab.key}
                className={`flex h-[52px] items-center justify-between rounded-[10px] border px-3 py-2 ${
                  active ? "border-[#0053E0] bg-[#ECF1FA]" : "border-[#E0E3E8] bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveDrawerTab(tab.key)}
                  className={`flex h-9 w-[102px] cursor-pointer items-center whitespace-nowrap px-[7px] text-[13px] leading-[1.45em] ${
                    active ? "font-bold text-[#0053E0]" : "font-medium text-[#090909]"
                  }`}
                >
                  {tab.label}
                </button>
                <div className="flex h-9 items-center justify-center p-1.5">
                  <ToggleSwitch
                    checked={item.detail[visibleKey]}
                    onChange={() => updateDetail({ [visibleKey]: !item.detail[visibleKey] })}
                    label={`切換${tab.label}顯示於前台`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <DrawerTabEditor tab={activeDrawerTab} detail={item.detail} onChange={updateDetail} />
      </div>
    </div>
  );
}
