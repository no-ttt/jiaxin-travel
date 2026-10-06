"use client";

import { useState } from "react";
import AdminSectionCard from "../ui/AdminSectionCard";
import ItemEditor from "./ItemEditor";
import TabManager from "./TabManager";
import { createJourneyCard, type CardPatch, type JourneyCard } from "./data";

export default function JourneyCardsSection({
  items,
  onItemsChange,
}: {
  items: JourneyCard[];
  /** Functional, so uploads finishing later append to the latest draft. */
  onItemsChange: (updater: (items: JourneyCard[]) => JourneyCard[]) => void;
}) {
  const [activeKey, setActiveKey] = useState(items[0]?.key ?? "");
  const activeItem = items.find((item) => item.key === activeKey) ?? items[0];

  const updateItem = (key: string, patch: CardPatch) => {
    onItemsChange((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, ...(typeof patch === "function" ? patch(item) : patch) } : item
      )
    );
  };

  const addItem = () => {
    const newItem = createJourneyCard();
    onItemsChange((prev) => [...prev, newItem]);
    setActiveKey(newItem.key);
  };

  const deleteItem = (key: string) => {
    const remaining = items.filter((item) => item.key !== key);
    onItemsChange((prev) => prev.filter((item) => item.key !== key));
    if (activeKey === key) setActiveKey(remaining[0]?.key ?? "");
  };

  return (
    <AdminSectionCard
      title="旅程卡片管理"
      description="管理「最近的旅程」拼貼卡片內容，前台將以卡片方式顯示，滑鼠移入可看到好評與評分，點擊即開啟旅程相簿；點擊「更多旅程故事」可再展開更多卡片。"
    >
      <TabManager
        title="項目管理"
        description={`目前 ${items.length} 個旅程卡片，可個別開關顯示、編輯內容。`}
        tabs={items.map((item) => ({ id: item.key, name: item.name, visible: item.visible }))}
        activeId={activeItem?.key ?? ""}
        onSelect={setActiveKey}
        onToggleVisible={(key) => updateItem(key, (item) => ({ visible: !item.visible }))}
        onAdd={addItem}
      />

      {activeItem && (
        <ItemEditor
          key={activeItem.key}
          item={activeItem}
          onChange={(patch) => updateItem(activeItem.key, patch)}
          onDelete={() => deleteItem(activeItem.key)}
        />
      )}
    </AdminSectionCard>
  );
}
