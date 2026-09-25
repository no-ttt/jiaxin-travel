"use client";

import { useState } from "react";
import AdminInfoNote from "../ui/AdminInfoNote";
import AdminSectionCard from "../ui/AdminSectionCard";
import { generateId } from "../ui/generateId";
import ItemEditor from "./ItemEditor";
import TabManager from "./TabManager";
import { createJourneyCard, type JourneyCard } from "./data";

export default function JourneyCardsSection({
  items,
  onItemsChange,
}: {
  items: JourneyCard[];
  onItemsChange: (items: JourneyCard[]) => void;
}) {
  const [activeItemId, setActiveItemId] = useState(items[0]?.id ?? "");
  const activeItem = items.find((item) => item.id === activeItemId) ?? items[0];

  const updateItem = (id: string, patch: Partial<JourneyCard>) => {
    onItemsChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    const newItem = createJourneyCard(generateId("journey"));
    onItemsChange([...items, newItem]);
    setActiveItemId(newItem.id);
  };

  const deleteItem = (id: string) => {
    const remaining = items.filter((item) => item.id !== id);
    onItemsChange(remaining);
    if (activeItemId === id) setActiveItemId(remaining[0]?.id ?? "");
  };

  return (
    <AdminSectionCard
      title="旅程卡片管理"
      description="管理「最近的旅程」拼貼卡片內容，前台將以卡片方式顯示，滑鼠移入可看到好評與評分，點擊即開啟旅程相簿；點擊「更多旅程故事」可再展開更多卡片。"
    >
      <TabManager
        title="項目管理"
        description={`目前 ${items.length} 個旅程卡片，可個別開關顯示、編輯內容。`}
        tabs={items.map((item) => ({ id: item.id, name: item.name, visible: item.visible }))}
        activeId={activeItem?.id ?? ""}
        onSelect={setActiveItemId}
        onToggleVisible={(id) => {
          const item = items.find((i) => i.id === id);
          if (item) updateItem(id, { visible: !item.visible });
        }}
        onAdd={addItem}
      />

      {activeItem && (
        <ItemEditor
          item={activeItem}
          onChange={(patch) => updateItem(activeItem.id, patch)}
          onDelete={items.length > 1 ? () => deleteItem(activeItem.id) : undefined}
        />
      )}

      <AdminInfoNote>
        其餘 7 個旅程卡片（含「更多旅程故事」展開後的卡片）與各自相簿內的相片／影片編輯方式與此範例相同；媒體以批次上傳、可個別填寫說明的方式管理。
      </AdminInfoNote>
    </AdminSectionCard>
  );
}
