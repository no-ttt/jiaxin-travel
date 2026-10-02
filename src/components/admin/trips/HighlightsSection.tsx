"use client";

import { useState } from "react";
import AdminInfoNote from "@/components/admin/ui/AdminInfoNote";
import { generateId } from "@/components/admin/ui/generateId";
import RichTextEditor from "./RichTextEditor";
import { AddImageTile, TripImagePreview, useImageReorder } from "./TripImageTiles";
import { moveById, type EditableFeatureCard } from "./content";

type HighlightCard = EditableFeatureCard;

function RowActionButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#E0E3E8] bg-white px-3 py-2 text-[13px] font-medium leading-[1.45em] text-[#535F71] hover:border-[#0053E0] hover:bg-[#ECF1FA] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E0E3E8] disabled:hover:bg-white"
    >
      {label}
    </button>
  );
}

export default function HighlightsSection({
  title,
  description,
  value: cards,
  onChange: setCards,
}: {
  title: string;
  description: string;
  value: HighlightCard[];
  onChange: (updater: (prev: HighlightCard[]) => HighlightCard[]) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const reorderCards = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setCards((prev) => {
      const sourceIndex = prev.findIndex((c) => c._id === sourceId);
      const targetIndex = prev.findIndex((c) => c._id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const updateCard = (id: string, patch: Partial<HighlightCard>) => {
    setCards((prev) => prev.map((c) => (c._id === id ? { ...c, ...patch } : c)));
  };

  const toggleExpand = (id: string) => {
    setCards((prev) => prev.map((c) => (c._id === id ? { ...c, expanded: !c.expanded } : c)));
  };

  const duplicateCard = (id: string) => {
    setCards((prev) => {
      const index = prev.findIndex((c) => c._id === id);
      if (index === -1) return prev;
      const source = prev[index];
      const copy: HighlightCard = {
        ...source,
        _id: generateId("card"),
        images: source.images.map((img) => ({ ...img, _id: generateId("img") })),
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  const moveCardUp = (id: string) => {
    setCards((prev) => {
      const index = prev.findIndex((c) => c._id === id);
      if (index <= 0) return prev;
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c._id !== id));
  };

  // Reorders images within the same card; drops onto another card's image are ignored.
  const imageReorder = useImageReorder((fromId, toId) =>
    setCards((prev) =>
      prev.map((item) =>
        item.images.some((img) => img._id === fromId) ? { ...item, images: moveById(item.images, fromId, toId) } : item
      )
    )
  );

  const addImage = (cardId: string, mediaId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c._id === cardId
          ? { ...c, images: [...c.images, { _id: generateId("img"), media_id: mediaId, caption: "" }] }
          : c
      )
    );
  };

  const removeImage = (cardId: string, imageId: string) => {
    setCards((prev) =>
      prev.map((c) => (c._id === cardId ? { ...c, images: c.images.filter((img) => img._id !== imageId) } : c))
    );
  };

  const updateImageCaption = (cardId: string, imageId: string, caption: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c._id === cardId
          ? { ...c, images: c.images.map((img) => (img._id === imageId ? { ...img, caption } : img)) }
          : c
      )
    );
  };

  const addCard = () => {
    setCards((prev) => [
      ...prev,
      {
        _id: generateId("card"),
        title: "",
        body_html: "",
        images: [],
        expanded: true,
      },
    ]);
  };

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold leading-[1.45em] text-[#090909]">{title}</h2>
          <span className="rounded-full bg-[#ECF1FA] px-2 py-[3px] text-[11px] font-bold leading-[1.45em] text-[#0053E0]">
            僅自建行程適用
          </span>
        </div>
        <p className="w-full text-[13px] font-medium leading-[1.45em] text-[#535F71] sm:max-w-[720px]">
          {description}
        </p>
      </div>

      <AdminInfoNote>前台呈現規則：1 張圖片顯示為單圖；2 張以上自動切換為輪播。圖片註解會顯示於圖片下方。</AdminInfoNote>

      <div className="flex flex-col gap-4">
        {cards.map((card, index) => {
          const cardNumber = String(index + 1).padStart(2, "0");

          const isDragOver = dragOverId === card._id && draggingId !== card._id;
          const dragHandlers = {
            draggable: true,
            onDragStart: () => setDraggingId(card._id),
            onDragEnd: () => {
              setDraggingId(null);
              setDragOverId(null);
            },
            onDragOver: (e: React.DragEvent) => {
              e.preventDefault();
              if (draggingId && draggingId !== card._id) setDragOverId(card._id);
            },
            onDragLeave: () => setDragOverId((prev) => (prev === card._id ? null : prev)),
            onDrop: (e: React.DragEvent) => {
              e.preventDefault();
              if (draggingId) reorderCards(draggingId, card._id);
              setDraggingId(null);
              setDragOverId(null);
            },
          };

          if (!card.expanded) {
            return (
              <div
                key={card._id}
                {...dragHandlers}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-[18px] transition ${
                  isDragOver ? "border-[#0053E0]" : "border-[#E0E3E8]"
                } ${draggingId === card._id ? "opacity-50" : ""}`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span className="cursor-grab text-lg leading-none text-[#535F71]">⋮⋮</span>
                  <span className="text-sm font-bold leading-[1.45em] text-[#090909]">特色卡面 {cardNumber}</span>
                  <span className="truncate text-[13px] leading-[1.45em] text-[#090909]">{card.title || "（未命名）"}</span>
                  <span className="shrink-0 rounded-[14px] bg-[#FAFAFA] px-2.5 py-1 text-xs font-medium leading-[1.45em] text-[#535F71]">
                    {card.images.length} 張圖片
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <RowActionButton label="複製" onClick={() => duplicateCard(card._id)} />
                  <RowActionButton label="展開" onClick={() => toggleExpand(card._id)} />
                  <RowActionButton label="刪除" onClick={() => removeCard(card._id)} />
                </div>
              </div>
            );
          }

          return (
            <div
              key={card._id}
              {...dragHandlers}
              className={`flex flex-col gap-[18px] rounded-2xl border bg-white p-[18px] transition ${
                isDragOver ? "border-[#0053E0]" : "border-[#E0E3E8]"
              } ${draggingId === card._id ? "opacity-50" : ""}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span className="cursor-grab text-lg leading-none text-[#535F71]">⋮⋮</span>
                  <span className="text-[15px] font-bold leading-[1.45em] text-[#090909]">
                    特色卡面 {cardNumber}
                  </span>
                  <span className="rounded-[14px] bg-[#ECF1FA] px-2.5 py-1 text-xs font-medium leading-[1.45em] text-[#002366]">
                    {card.images.length} 張圖片
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <RowActionButton label="複製" onClick={() => duplicateCard(card._id)} />
                  <RowActionButton label="上移" onClick={() => moveCardUp(card._id)} disabled={index === 0} />
                  <RowActionButton label="收合" onClick={() => toggleExpand(card._id)} />
                  <RowActionButton label="刪除" onClick={() => removeCard(card._id)} />
                </div>
              </div>

              <div className="flex flex-col gap-[7px]">
                <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">卡面標題</span>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => updateCard(card._id, { title: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
                />
              </div>

              <div className="flex flex-col gap-[7px]">
                <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">內容</span>
                <RichTextEditor
                  value={card.body_html}
                  onChange={(html) => updateCard(card._id, { body_html: html })}
                  placeholder="輸入卡面內容，可使用粗體、條列、連結等格式。內容會依卡面順序顯示於行程特色區塊。"
                />
                <p className="text-xs leading-[1.45em] text-[#535F71]">
                  可貼上多段文字；編輯器會保留基本段落與列表格式。
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">圖片與註解</span>
                  <span className="text-xs leading-[1.45em] text-[#535F71]">可新增多張並拖曳排序</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {card.images.map((img) => (
                    <div
                      key={img._id}
                      {...imageReorder.dropProps(img._id)}
                      className={`flex w-[288px] flex-col gap-2 ${imageReorder.tileClass(img._id)}`}
                    >
                      <TripImagePreview
                        mediaId={img.media_id}
                        dragHandleProps={imageReorder.handleProps(img._id)}
                        onRemove={() => removeImage(card._id, img._id)}
                        removeClassName="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/50 text-xs text-white hover:bg-black/70"
                      />
                      <div className="flex flex-col gap-[7px]">
                        <span className="text-xs font-medium leading-[1.45em] text-[#090909]">圖片註解</span>
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => updateImageCaption(card._id, img._id, e.target.value)}
                          className="h-[38px] w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-sm leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
                        />
                      </div>
                    </div>
                  ))}
                  <AddImageTile onUploaded={(mediaId) => addImage(card._id, mediaId)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addCard}
        className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded-lg border border-[#0053E0] text-[13px] font-bold leading-[1.45em] text-[#0053E0] hover:bg-[#ECF1FA]"
      >
        ＋ 新增特色卡面
      </button>
    </section>
  );
}
