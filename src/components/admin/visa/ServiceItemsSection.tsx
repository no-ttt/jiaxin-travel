"use client";

import { useState } from "react";
import AdminSectionCard from "../ui/AdminSectionCard";
import { generateId } from "../ui/generateId";
import ItemEditor from "./ItemEditor";
import TabManager from "./TabManager";
import { createServiceItem, type ServiceItem } from "./data";

export default function ServiceItemsSection({
  title,
  description,
  managerTitle,
  managerDescription,
  items,
  onItemsChange,
}: {
  title: string;
  description: string;
  managerTitle: string;
  managerDescription: string;
  items: ServiceItem[];
  onItemsChange: (items: ServiceItem[]) => void;
}) {
  const [activeItemId, setActiveItemId] = useState(items[0]?.id ?? "");
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeItemId)
  );
  const activeItem = items[activeIndex];

  const updateItem = (id: string, patch: Partial<ServiceItem>) => {
    onItemsChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    const fieldLabels = items[0]?.fields.map((field) => field.label) ?? [];
    const newItem = createServiceItem(generateId("item"), fieldLabels);
    onItemsChange([...items, newItem]);
    setActiveItemId(newItem.id);
  };

  const deleteItem = (id: string) => {
    const remaining = items.filter((item) => item.id !== id);
    onItemsChange(remaining);
    if (activeItemId === id) setActiveItemId(remaining[0]?.id ?? "");
  };

  return (
    <AdminSectionCard title={title} description={description}>
      <TabManager
        title={managerTitle}
        description={managerDescription}
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
          index={activeIndex}
          onChange={(patch) => updateItem(activeItem.id, patch)}
          onDelete={items.length > 1 ? () => deleteItem(activeItem.id) : undefined}
        />
      )}
    </AdminSectionCard>
  );
}
