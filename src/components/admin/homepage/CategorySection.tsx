"use client";

import { useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import AdminTextInput from "../ui/AdminTextInput";
import Dropdown from "@/components/ui/Dropdown";
import { generateId } from "../ui/generateId";
import { useDirtyTracking } from "../ui/useDirtyTracking";
import { AVAILABLE_TRIPS, INITIAL_HOMEPAGE_CATEGORY_TABS, type CategoryTab } from "./data";

export default function CategorySection({
  onDirtyChange,
  resetKey,
}: {
  onDirtyChange?: (dirty: boolean) => void;
  resetKey?: unknown;
}) {
  const [tabs, setTabs] = useState<CategoryTab[]>(INITIAL_HOMEPAGE_CATEGORY_TABS);
  useDirtyTracking(tabs, onDirtyChange, resetKey);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  const updateTab = (id: string, patch: Partial<CategoryTab>) => {
    setTabs((prev) => prev.map((tab) => (tab.id === id ? { ...tab, ...patch } : tab)));
  };

  const toggleTabVisibility = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setTabs((prev) => prev.map((tab) => (tab.id === id ? { ...tab, visible: !tab.visible } : tab)));
  };

  const selectedTripIds = new Set(activeTab.trips.map((trip) => trip.tripId));
  const unselectedTrips = AVAILABLE_TRIPS.filter((trip) => !selectedTripIds.has(trip.id));

  const addTrip = () => {
    if (unselectedTrips.length === 0) return;
    updateTab(activeTab.id, {
      trips: [...activeTab.trips, { id: generateId("trip"), tripId: unselectedTrips[0].id }],
    });
  };

  const updateTrip = (rowId: string, tripId: string) => {
    updateTab(activeTab.id, {
      trips: activeTab.trips.map((trip) => (trip.id === rowId ? { ...trip, tripId } : trip)),
    });
  };

  const removeTrip = (rowId: string) => {
    updateTab(activeTab.id, {
      trips: activeTab.trips.filter((trip) => trip.id !== rowId),
    });
  };

  return (
    <AdminSectionCard
      title="精選行程分類"
      description="設定首頁三個精選行程分類（保證出團／精緻嚴選／主題旅遊）各自顯示的行程，並可開關整個分類顯示。"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[13px] font-bold leading-[1.45em] text-[#090909]">分類管理</h3>
          <p className="text-xs leading-[1.45em] text-[#535F71]">固定三個分類，可個別開關顯示、編輯所屬行程。</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`flex h-[52px] items-center justify-between gap-3 rounded-xl border px-3 py-2 transition ${
                  isActive ? "border-[#0053E0] bg-[#ECF1FA]" : "border-[#E0E3E8] bg-white"
                }`}
              >
                <span
                  className={`text-[13px] font-medium leading-[1.45em] ${
                    isActive ? "font-bold text-[#0053E0]" : "text-[#090909]"
                  }`}
                >
                  {tab.label}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => toggleTabVisibility(tab.id, event)}
                  className={`relative h-6 w-[42px] shrink-0 cursor-pointer rounded-xl transition ${
                    tab.visible ? "bg-[#0053E0]" : "bg-[#E0E3E8]"
                  }`}
                  aria-label={`切換${tab.label}顯示`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      tab.visible ? "left-[19px]" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-[#E0E3E8] p-[18px]">
        <h3 className="text-sm font-bold leading-[1.45em] text-[#090909]">目前編輯：{activeTab.label}</h3>

        <div className="flex gap-4">
          <AdminTextInput
            label="標題上方英文字"
            value={activeTab.eyebrow}
            onChange={(value) => updateTab(activeTab.id, { eyebrow: value })}
          />
          <AdminTextInput
            label="標題"
            value={activeTab.label}
            onChange={(value) => updateTab(activeTab.id, { label: value })}
          />
        </div>

        <p className="text-sm font-bold leading-[1.45em] text-[#090909]">
          已選行程（{activeTab.trips.length}）－ 依序顯示於前台輪播
        </p>
        {activeTab.trips.map((trip) => {
          const options = AVAILABLE_TRIPS.filter(
            (candidate) => candidate.id === trip.tripId || !selectedTripIds.has(candidate.id)
          );
          const optionLabels = options.map((option) => option.label);
          const currentLabel = AVAILABLE_TRIPS.find((candidate) => candidate.id === trip.tripId)?.label ?? "";

          return (
            <div key={trip.id} className="flex items-center gap-2">
              <div className="flex-1">
                <Dropdown
                  placeholder="請選擇行程"
                  options={optionLabels}
                  value={currentLabel}
                  onChange={(label) => {
                    const selected = AVAILABLE_TRIPS.find((candidate) => candidate.label === label);
                    if (selected) updateTrip(trip.id, selected.id);
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => removeTrip(trip.id)}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E0E3E8] text-sm text-[#535F71] transition hover:border-[#0053E0] hover:bg-[#ECF1FA]"
                aria-label="刪除行程"
              >
                ×
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={addTrip}
          disabled={unselectedTrips.length === 0}
          className="w-fit cursor-pointer text-xs font-medium leading-[1.45em] text-[#0053E0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ＋ 新增行程
        </button>
      </div>

      <AdminInfoNote>
        僅「顯示」開啟的分類會出現在首頁；每個分類最多建議放 3～6 個行程，超過將以輪播方式呈現。
      </AdminInfoNote>
    </AdminSectionCard>
  );
}
