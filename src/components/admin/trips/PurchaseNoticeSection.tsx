"use client";

import { useState } from "react";
import AdminInfoNote from "@/components/admin/ui/AdminInfoNote";
import { generateId } from "@/components/admin/ui/generateId";
import RichTextEditor from "./RichTextEditor";
import type { EditableNoticeTab } from "./content";

type NoticeTab = EditableNoticeTab;

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

export default function PurchaseNoticeSection({
  title,
  description,
  value: tabs,
  onChange: setTabs,
}: {
  title: string;
  description: string;
  value: NoticeTab[];
  onChange: (updater: (prev: NoticeTab[]) => NoticeTab[]) => void;
}) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?._id ?? "");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const activeTab = tabs.find((t) => t._id === activeTabId) ?? tabs[0];

  const reorderTabs = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setTabs((prev) => {
      const sourceIndex = prev.findIndex((t) => t._id === sourceId);
      const targetIndex = prev.findIndex((t) => t._id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const updateTab = (id: string, patch: Partial<NoticeTab>) => {
    setTabs((prev) => prev.map((t) => (t._id === id ? { ...t, ...patch } : t)));
  };

  const removeTab = (id: string) => {
    const next = tabs.filter((t) => t._id !== id);
    if (activeTabId === id && next.length > 0) setActiveTabId(next[0]._id);
    setTabs((prev) => prev.filter((t) => t._id !== id));
  };

  const addTab = () => {
    const newTab: NoticeTab = {
      _id: generateId("tab"),
      title: "新分頁",
      visible: true,
      body_html: "",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab._id);
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
            const isActive = tab._id === activeTabId;
            const isDragOver = dragOverId === tab._id && draggingId !== tab._id;
            return (
              <div
                key={tab._id}
                draggable
                onDragStart={() => setDraggingId(tab._id)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setDragOverId(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggingId && draggingId !== tab._id) setDragOverId(tab._id);
                }}
                onDragLeave={() => setDragOverId((prev) => (prev === tab._id ? null : prev))}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggingId) reorderTabs(draggingId, tab._id);
                  setDraggingId(null);
                  setDragOverId(null);
                }}
                className={`flex h-[52px] items-center gap-1.5 rounded-[10px] border p-2 transition ${
                  isActive ? "border-[#0053E0] bg-[#ECF1FA]" : isDragOver ? "border-[#0053E0] bg-white" : "border-[#E0E3E8] bg-white"
                } ${draggingId === tab._id ? "opacity-50" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTabId(tab._id)}
                  className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-[7px] px-1.5 text-left"
                >
                  <span className="cursor-grab text-lg leading-none text-[#535F71]">⋮⋮</span>
                  <span
                    className={`text-[13px] font-bold leading-[1.45em] ${
                      isActive ? "text-[#0053E0]" : "text-[#090909]"
                    }`}
                  >
                    {tab.title}
                  </span>
                </button>
                <div className="flex h-9 shrink-0 items-center gap-2 px-0.5">
                  <span className="text-[11px] font-medium leading-[1.45em] text-[#535F71]">顯示</span>
                  <ToggleSwitch checked={tab.visible} onChange={(v) => updateTab(tab._id, { visible: v })} />
                </div>
                <button
                  type="button"
                  onClick={() => removeTab(tab._id)}
                  aria-label={`刪除分頁 ${tab.title}`}
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
              目前編輯：{activeTab.title}
            </span>
            <span className="text-xs leading-[1.45em] text-[#535F71]">切換上方分頁即可編輯其他內容</span>
          </div>

          <div className="flex flex-col gap-[7px]">
            <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">分頁標題</span>
            <input
              type="text"
              value={activeTab.title}
              onChange={(e) => updateTab(activeTab._id, { title: e.target.value })}
              className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
            />
          </div>

          <div className="flex flex-col gap-[7px]">
            <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">內容</span>
            <RichTextEditor
              key={activeTab._id}
              value={activeTab.body_html}
              onChange={(html) => updateTab(activeTab._id, { body_html: html })}
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
