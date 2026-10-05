"use client";

import { useState } from "react";
import AdminSectionCard from "../ui/AdminSectionCard";
import ItemEditor from "./ItemEditor";
import TabManager from "./TabManager";
import type { EditableServiceItem, FieldConfig } from "./data";

export default function ServiceItemsSection<T extends EditableServiceItem>({
  title,
  description,
  managerTitle,
  managerDescription,
  fields,
  items,
  createItem,
  onItemsChange,
}: {
  title: string;
  description: string;
  managerTitle: string;
  managerDescription: string;
  fields: FieldConfig<T>;
  items: T[];
  createItem: () => T;
  onItemsChange: (items: T[]) => void;
}) {
  const [activeItemId, setActiveItemId] = useState(items[0]?._id ?? "");
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item._id === activeItemId)
  );
  const activeItem = items[activeIndex];

  const updateItem = (id: string, patch: Partial<T>) => {
    onItemsChange(items.map((item) => (item._id === id ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    const newItem = createItem();
    onItemsChange([...items, newItem]);
    setActiveItemId(newItem._id);
  };

  const deleteItem = (id: string) => {
    const remaining = items.filter((item) => item._id !== id);
    onItemsChange(remaining);
    if (activeItemId === id) setActiveItemId(remaining[0]?._id ?? "");
  };

  return (
    <AdminSectionCard title={title} description={description}>
      <TabManager
        title={managerTitle}
        description={managerDescription}
        tabs={items.map((item) => ({ id: item._id, name: item.name, visible: item.visible }))}
        activeId={activeItem?._id ?? ""}
        onSelect={setActiveItemId}
        onToggleVisible={(id) => {
          const item = items.find((i) => i._id === id);
          if (item) updateItem(id, { visible: !item.visible } as Partial<T>);
        }}
        onAdd={addItem}
      />

      {activeItem && (
        <ItemEditor
          key={activeItem._id}
          item={activeItem}
          index={activeIndex}
          fields={fields}
          onChange={(patch) => updateItem(activeItem._id, patch)}
          onDelete={items.length > 1 ? () => deleteItem(activeItem._id) : undefined}
        />
      )}
    </AdminSectionCard>
  );
}
