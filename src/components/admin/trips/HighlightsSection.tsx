"use client";

import { useState } from "react";
import { generateId } from "@/components/admin/ui/generateId";
import RichTextEditor from "./RichTextEditor";

type ImageItem = { id: string; caption: string };

type HighlightCard = {
  id: string;
  title: string;
  content: string;
  images: ImageItem[];
  expanded: boolean;
};

const INITIAL_CARDS: HighlightCard[] = [
  {
    id: generateId("card"),
    title: "北歐極境景觀與精選體驗",
    content: "<p>深入北歐峽灣景觀，安排極光觀賞、遊船體驗與在地美食探索，感受絕美自然風光。</p>",
    images: [
      { id: generateId("img"), caption: "飯店外觀與周邊環境" },
      { id: generateId("img"), caption: "館內設施與客房空間" },
    ],
    expanded: true,
  },
  {
    id: generateId("card"),
    title: "波羅的海遊輪",
    content: "",
    images: [{ id: generateId("img"), caption: "" }],
    expanded: false,
  },
];

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

export default function HighlightsSection({ title, description }: { title: string; description: string }) {
  const [cards, setCards] = useState<HighlightCard[]>(INITIAL_CARDS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const reorderCards = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setCards((prev) => {
      const sourceIndex = prev.findIndex((c) => c.id === sourceId);
      const targetIndex = prev.findIndex((c) => c.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const updateCard = (id: string, patch: Partial<HighlightCard>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const toggleExpand = (id: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, expanded: !c.expanded } : c)));
  };

  const duplicateCard = (id: string) => {
    setCards((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index === -1) return prev;
      const source = prev[index];
      const copy: HighlightCard = {
        ...source,
        id: generateId("card"),
        images: source.images.map((img) => ({ ...img, id: generateId("img") })),
      };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  const moveCardUp = (id: string) => {
    setCards((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index <= 0) return prev;
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const addImage = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, images: [...c.images, { id: generateId("img"), caption: "" }] } : c
      )
    );
  };

  const removeImage = (cardId: string, imageId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, images: c.images.filter((img) => img.id !== imageId) } : c))
    );
  };

  const updateImageCaption = (cardId: string, imageId: string, caption: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, images: c.images.map((img) => (img.id === imageId ? { ...img, caption } : img)) }
          : c
      )
    );
  };

  const addCard = () => {
    setCards((prev) => [
      ...prev,
      {
        id: generateId("card"),
        title: "",
        content: "",
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

      <div className="flex items-center gap-2 rounded-[10px] bg-[#FAFAFA] px-3.5 py-2.5">
        <p className="text-[12.5px] leading-[1.45em] text-[#535F71]">
          前台呈現規則：1 張圖片顯示為單圖；2 張以上自動切換為輪播。圖片註解會顯示於圖片下方。
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {cards.map((card, index) => {
          const cardNumber = String(index + 1).padStart(2, "0");

          const isDragOver = dragOverId === card.id && draggingId !== card.id;
          const dragHandlers = {
            draggable: true,
            onDragStart: () => setDraggingId(card.id),
            onDragEnd: () => {
              setDraggingId(null);
              setDragOverId(null);
            },
            onDragOver: (e: React.DragEvent) => {
              e.preventDefault();
              if (draggingId && draggingId !== card.id) setDragOverId(card.id);
            },
            onDragLeave: () => setDragOverId((prev) => (prev === card.id ? null : prev)),
            onDrop: (e: React.DragEvent) => {
              e.preventDefault();
              if (draggingId) reorderCards(draggingId, card.id);
              setDraggingId(null);
              setDragOverId(null);
            },
          };

          if (!card.expanded) {
            return (
              <div
                key={card.id}
                {...dragHandlers}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-[18px] transition ${
                  isDragOver ? "border-[#0053E0]" : "border-[#E0E3E8]"
                } ${draggingId === card.id ? "opacity-50" : ""}`}
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
                  <RowActionButton label="複製" onClick={() => duplicateCard(card.id)} />
                  <RowActionButton label="展開" onClick={() => toggleExpand(card.id)} />
                  <RowActionButton label="刪除" onClick={() => removeCard(card.id)} />
                </div>
              </div>
            );
          }

          return (
            <div
              key={card.id}
              {...dragHandlers}
              className={`flex flex-col gap-[18px] rounded-2xl border bg-white p-[18px] transition ${
                isDragOver ? "border-[#0053E0]" : "border-[#E0E3E8]"
              } ${draggingId === card.id ? "opacity-50" : ""}`}
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
                  <RowActionButton label="複製" onClick={() => duplicateCard(card.id)} />
                  <RowActionButton label="上移" onClick={() => moveCardUp(card.id)} disabled={index === 0} />
                  <RowActionButton label="收合" onClick={() => toggleExpand(card.id)} />
                  <RowActionButton label="刪除" onClick={() => removeCard(card.id)} />
                </div>
              </div>

              <div className="flex flex-col gap-[7px]">
                <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">卡面標題</span>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => updateCard(card.id, { title: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-[15px] leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
                />
              </div>

              <div className="flex flex-col gap-[7px]">
                <span className="text-[13px] font-medium leading-[1.45em] text-[#090909]">內容</span>
                <RichTextEditor
                  value={card.content}
                  onChange={(html) => updateCard(card.id, { content: html })}
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
                    <div key={img.id} className="flex w-[288px] flex-col gap-2">
                      <div className="relative h-[116px] w-full overflow-hidden rounded-[10px] bg-gradient-to-br from-[#0B1F3A] to-[#1B3A63]">
                        <button
                          type="button"
                          onClick={() => removeImage(card.id, img.id)}
                          aria-label="移除圖片"
                          className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/50 text-xs text-white hover:bg-black/70"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex flex-col gap-[7px]">
                        <span className="text-xs font-medium leading-[1.45em] text-[#090909]">圖片註解</span>
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => updateImageCaption(card.id, img.id, e.target.value)}
                          className="h-[38px] w-full rounded-xl border border-[#E0E3E8] bg-[#FAFAFA] px-4 text-sm leading-[1.5em] text-[#0A0A0C] outline-none focus:border-[#0053E0]"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex w-[288px] flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => addImage(card.id)}
                      className="flex h-[116px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[#E0E3E8] bg-[#FAFAFA] hover:border-[#0053E0]"
                    >
                      <span className="text-[22px] leading-[1.45em] text-[#0053E0]">＋</span>
                      <span className="text-[13px] font-medium leading-[1.45em] text-[#0053E0]">新增圖片</span>
                    </button>
                    <span className="text-xs leading-[1.45em] text-[#535F71]">支援 JPG / PNG</span>
                  </div>
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
