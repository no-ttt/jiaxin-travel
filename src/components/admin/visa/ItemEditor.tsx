"use client";

import { useState } from "react";
import AdminTextInput from "../ui/AdminTextInput";
import ToggleSwitch from "../ui/ToggleSwitch";
import DrawerTabEditor from "./DrawerTabEditor";
import type { ServiceItem } from "./data";

export default function ItemEditor({
  item,
  index,
  onChange,
  onDelete,
}: {
  item: ServiceItem;
  index: number;
  onChange: (patch: Partial<ServiceItem>) => void;
  onDelete?: () => void;
}) {
  const [activeDrawerTabId, setActiveDrawerTabId] = useState(item.drawerTabs[0]?.id ?? "");
  const activeDrawerTab = item.drawerTabs.find((tab) => tab.id === activeDrawerTabId) ?? item.drawerTabs[0];

  const updateField = (fieldIndex: number, value: string) => {
    onChange({
      fields: item.fields.map((field, i) => (i === fieldIndex ? { ...field, value } : field)),
    });
  };

  const updateDrawerTab = (id: string, patch: Partial<ServiceItem["drawerTabs"][number]>) => {
    onChange({
      drawerTabs: item.drawerTabs.map((tab) => (tab.id === id ? { ...tab, ...patch } : tab)),
    });
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

      <AdminTextInput label="項目名稱" value={item.name} onChange={(name) => onChange({ name })} />

      <div className="grid grid-cols-3 gap-4">
        {item.fields.map((field, fieldIndex) => (
          <AdminTextInput
            key={field.label}
            label={field.label}
            value={field.value}
            onChange={(value) => updateField(fieldIndex, value)}
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
          {item.drawerTabs.map((tab) => {
            const active = tab.id === activeDrawerTab?.id;
            return (
              <div
                key={tab.id}
                className={`flex h-[52px] items-center justify-between rounded-[10px] border px-3 py-2 ${
                  active ? "border-[#0053E0] bg-[#ECF1FA]" : "border-[#E0E3E8] bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveDrawerTabId(tab.id)}
                  className={`flex h-9 w-[102px] cursor-pointer items-center whitespace-nowrap px-[7px] text-[13px] leading-[1.45em] ${
                    active ? "font-bold text-[#0053E0]" : "font-medium text-[#090909]"
                  }`}
                >
                  {tab.label}
                </button>
                <div className="flex h-9 items-center justify-center p-1.5">
                  <ToggleSwitch
                    checked={tab.visible}
                    onChange={() => updateDrawerTab(tab.id, { visible: !tab.visible })}
                    label={`切換${tab.label}顯示於前台`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {activeDrawerTab && (
          <DrawerTabEditor
            tab={activeDrawerTab}
            otherTabLabels={item.drawerTabs.filter((t) => t.id !== activeDrawerTab.id).map((t) => t.label)}
            onChange={(patch) => updateDrawerTab(activeDrawerTab.id, patch)}
          />
        )}
      </div>
    </div>
  );
}
