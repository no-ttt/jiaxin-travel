"use client";

import { useCallback, useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminToast from "../ui/AdminToast";
import AdminSectionCard from "../ui/AdminSectionCard";
import AdminTextInput from "../ui/AdminTextInput";
import Dropdown from "@/components/ui/Dropdown";
import { useTripList } from "@/lib/api/hooks/useTrips";
import type { CategoryTab } from "./data";

type TripOption = { id: string; label: string };

export default function CategorySection({
  value: tabs,
  onChange: setTabs,
}: {
  value: CategoryTab[];
  onChange: (updater: (prev: CategoryTab[]) => CategoryTab[]) => void;
}) {
  const [activeTabId, setActiveTabId] = useState(tabs[0].key);
  const activeTab = tabs.find((tab) => tab.key === activeTabId) ?? tabs[0];

  const [warning, setWarning] = useState<string | null>(null);
  const closeWarning = useCallback(() => setWarning(null), []);

  const { data: tripList, isLoading: isTripListLoading } = useTripList({ publish_status: "published", limit: 100 });
  const availableTrips: TripOption[] = (tripList?.items ?? []).map((trip) => ({
    id: trip.id,
    label: `${trip.product_name}（${trip.trip_code}）`,
  }));
  const tripLabel = (tripId: string) =>
    availableTrips.find((trip) => trip.id === tripId)?.label ?? tripId;

  const updateTab = (key: CategoryTab["key"], patch: Partial<CategoryTab>) => {
    setTabs((prev) => prev.map((tab) => (tab.key === key ? { ...tab, ...patch } : tab)));
  };

  const toggleTabVisibility = (key: CategoryTab["key"], event: React.MouseEvent) => {
    event.stopPropagation();
    setTabs((prev) => prev.map((tab) => (tab.key === key ? { ...tab, visible: !tab.visible } : tab)));
  };

  const selectedTripIds = new Set(activeTab.trip_ids);
  const unselectedTrips = availableTrips.filter((trip) => !selectedTripIds.has(trip.id));

  const addTrip = () => {
    if (isTripListLoading) {
      setWarning("行程清單載入中，請稍後再試");
      return;
    }
    if (availableTrips.length === 0) {
      setWarning("目前沒有已上架的行程，請先到「行程產品管理」上架行程");
      return;
    }
    if (unselectedTrips.length === 0) {
      setWarning("所有已上架的行程都已加入此分類");
      return;
    }
    updateTab(activeTab.key, { trip_ids: [...activeTab.trip_ids, unselectedTrips[0].id] });
  };

  const updateTrip = (index: number, tripId: string) => {
    updateTab(activeTab.key, {
      trip_ids: activeTab.trip_ids.map((id, i) => (i === index ? tripId : id)),
    });
  };

  const removeTrip = (index: number) => {
    updateTab(activeTab.key, { trip_ids: activeTab.trip_ids.filter((_, i) => i !== index) });
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
            const isActive = tab.key === activeTabId;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTabId(tab.key)}
                className={`flex h-[52px] items-center justify-between gap-3 rounded-xl border px-3 py-2 transition ${
                  isActive ? "border-[#0053E0] bg-[#ECF1FA]" : "border-[#E0E3E8] bg-white"
                }`}
              >
                <span
                  className={`text-[13px] font-medium leading-[1.45em] ${
                    isActive ? "font-bold text-[#0053E0]" : "text-[#090909]"
                  }`}
                >
                  {tab.title}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => toggleTabVisibility(tab.key, event)}
                  className={`relative h-6 w-[42px] shrink-0 cursor-pointer rounded-xl transition ${
                    tab.visible ? "bg-[#0053E0]" : "bg-[#E0E3E8]"
                  }`}
                  aria-label={`切換${tab.title}顯示`}
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
        <h3 className="text-sm font-bold leading-[1.45em] text-[#090909]">目前編輯：{activeTab.title}</h3>

        <div className="flex gap-4">
          <AdminTextInput
            label="標題上方英文字"
            value={activeTab.eyebrow_en}
            onChange={(value) => updateTab(activeTab.key, { eyebrow_en: value })}
          />
          <AdminTextInput
            label="標題"
            value={activeTab.title}
            onChange={(value) => updateTab(activeTab.key, { title: value })}
          />
        </div>

        <p className="text-sm font-bold leading-[1.45em] text-[#090909]">
          已選行程（{activeTab.trip_ids.length}）－ 依序顯示於前台輪播
        </p>
        {activeTab.trip_ids.map((tripId, index) => {
          const options = availableTrips.filter(
            (candidate) => candidate.id === tripId || !selectedTripIds.has(candidate.id)
          );
          const optionLabels = options.map((option) => option.label);
          const currentLabel = tripLabel(tripId);

          return (
            <div key={tripId} className="flex items-center gap-2">
              <div className="flex-1">
                <Dropdown
                  placeholder="請選擇行程"
                  options={optionLabels}
                  value={currentLabel}
                  onChange={(label) => {
                    const selected = availableTrips.find((candidate) => candidate.label === label);
                    if (selected) updateTrip(index, selected.id);
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => removeTrip(index)}
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
          className="w-fit cursor-pointer text-xs font-medium leading-[1.45em] text-[#0053E0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ＋ 新增行程
        </button>
      </div>

      <AdminInfoNote>
        僅「顯示」開啟的分類會出現在首頁；每個分類最多建議放 3～6 個行程，超過將以輪播方式呈現。
      </AdminInfoNote>
      {warning && <AdminToast message={warning} variant="warning" onClose={closeWarning} />}
    </AdminSectionCard>
  );
}
