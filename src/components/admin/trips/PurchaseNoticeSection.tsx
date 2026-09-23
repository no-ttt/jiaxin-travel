"use client";

import { useState } from "react";
import AdminInfoNote from "@/components/admin/ui/AdminInfoNote";
import { generateId } from "@/components/admin/ui/generateId";
import RichTextEditor from "./RichTextEditor";

type NoticeTab = {
  id: string;
  label: string;
  visible: boolean;
  content: string;
};

const INITIAL_TABS: NoticeTab[] = [
  {
    id: generateId("tab"),
    label: "行前必讀",
    visible: true,
    content: "<p>請於出發前詳閱行程內容、集合時間與地點，並確認證件效期符合當地入境規定。</p>",
  },
  { id: generateId("tab"), label: "護照簽證", visible: true, content: "" },
  { id: generateId("tab"), label: "旅遊指南", visible: true, content: "" },
  { id: generateId("tab"), label: "出入境須知", visible: true, content: "" },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex h-[18px] w-[30px] shrink-0 cursor-pointer items-center rounded-full p-0.5 transition ${
        checked ? "justify-end bg-[#0053E0]" : "justify-start bg-[#E0E3E8]"
      }`}
    >
      <span className="h-[14px] w-[14px] rounded-full bg-white shadow-[-1px_0.75px_1px_0px_rgba(0,0,0,0.05)]" />
    </button>
  );
}

export default function PurchaseNoticeSection({ title, description }: { title: string; description: string }) {
  const [tabs, setTabs] = useState<NoticeTab[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState(INITIAL_TABS[0].id);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const reorderTabs = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setTabs((prev) => {
      const sourceIndex = prev.findIndex((t) => t.id === sourceId);
      const targetIndex = prev.findIndex((t) => t.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const updateTab = (id: string, patch: Partial<NoticeTab>) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const removeTab = (id: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (activeTabId === id && next.length > 0) setActiveTabId(next[0].id);
      return next;
    });
  };

  const addTab = () => {
    const newTab: NoticeTab = {
      id: generateId("tab"),
      label: "新分頁",
      visible: true,
      content: "",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-[1.5em] text-[#090909]">{title}</h2>
        <p className="text-[13px] font-medium leading-[1.5em] text-[#535F71]">{description}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[13px] font-bold leading-[1.45em] text-[#090909]">分頁管理</span>
            <span className="text-xs leading-[1.45em] text-[#535F71]">預設 4 個，可新增、刪除或隱藏。</span>
          </div>
          <button
            type="button"
            onClick={addTab}
            className="flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-[7px] border border-[#E0E3E8] bg-white px-2.5 text-xs font-medium leading-[1.45em] text-[#0053E0] hover:bg-[#ECF1FA]"
          >
            ＋ 新增分頁
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isDragOver = dragOverId === tab.id && draggingId !== tab.id;
            return (
              <div
                key={tab.id}
                draggable
                onDragStart={() => setDraggingId(tab.id)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setDragOverId(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggingId && draggingId !== tab.id) setDragOverId(tab.id);
                }}
                onDragLeave={() => setDragOverId((prev) => (prev === tab.id ? null : prev))}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggingId) reorderTabs(draggingId, tab.id);
                  setDraggingId(null);
                  setDragOverId(null);
                }}
                className={`flex h-[52px] items-center gap-1.5 rounded-[10px] border p-2 transition ${
                  isActive ? "border-[#0053E0] bg-[#ECF1FA]" : isDragOver ? "border-[#0053E0] bg-white" : "border-[#E0E3E8] bg-white"
                } ${draggingId === tab.id ? "opacity-50" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-[7px] px-1.5 text-left"
                >
                  <span className="cursor-grab text-lg leading-none text-[#535F71]">⋮⋮</span>
                  <span
                    className={`text-[13px] font-bold leading-[1.45em] ${
                      isActive ? "text-[#0053E0]" : "text-[#090909]"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
                <div className="flex h-9 shrink-0 items-center gap-2 px-0.5">
                  <span className="text-[11px] font-medium leading-[1.45em] text-[#535F71]">顯示</span>
                  <ToggleSwitch checked={tab.visible} onChange={(v) => updateTab(tab.id, { visible: v })} />
                </div>
                <button
                  type="button"
                  onClick={() => removeTab(tab.id)}
                  aria-label={`刪除分頁 ${tab.label}`}
                  className="flex h-9 w-5 shrink-0 cursor-pointer items-center justify-center text-[15px] leading-none text-[#535F71]/70 hover:text-[#C71A1A]"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {activeTab && (
        <div className="flex flex-col gap-4 rounded-2xl border border-[#E0E3E8] bg-white p-[18px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold leading-[1.45em] text-[#090909]">
              目前編輯：{activeTab.label}
            </span>
            <span className="text-xs leading-[1.45em] text-[#535F71]">切換上方分頁即可編輯其他內容</span>
          </div>

          <div className="flex flex-col gap-[7px]">
            <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">分頁標題</span>
            <input
              type="text"
              value={activeTab.label}
              onChange={(e) => updateTab(activeTab.id, { label: e.target.value })}
              className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
            />
          </div>

          <div className="flex flex-col gap-[7px]">
            <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">內容</span>
            <RichTextEditor
              value={activeTab.content}
              onChange={(html) => updateTab(activeTab.id, { content: html })}
              placeholder="輸入前台「訂購須知」分頁要展示的內容。可使用段落、清單與連結。"
            />
            <p className="text-xs leading-[1.45em] text-[#535F71]">
              可貼上多段文字；編輯器會保留基本段落與列表格式。
            </p>
          </div>
        </div>
      )}

      <AdminInfoNote>僅「顯示」開啟且內容已填寫的分頁會出現在前台；分頁順序依此處排列。</AdminInfoNote>
    </section>
  );
}
