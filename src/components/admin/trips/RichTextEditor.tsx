"use client";

import { memo, useEffect, useRef, useState } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const FONT_SIZES = ["12 px", "14 px", "16 px", "18 px"];
const TEXT_COLORS: { value: string; label: string }[] = [
  { value: "#090909", label: "黑色" },
  { value: "#0053E0", label: "藍色" },
  { value: "#C71A1A", label: "紅色" },
  { value: "#1A7F37", label: "綠色" },
  { value: "#B45309", label: "橘色" },
];

function ToolbarButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border border-[#E0E3E8] bg-white px-2.5 text-xs leading-[1.45em] text-[#535F71] transition hover:bg-[#ECF1FA]"
    >
      {label}
    </button>
  );
}

function TextColorPicker({
  activeColor,
  onPick,
}: {
  activeColor: string;
  onPick: (color: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const activeLabel = TEXT_COLORS.find((c) => c.value === activeColor)?.label ?? "文字顏色";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border border-[#E0E3E8] bg-white px-2.5 text-xs leading-[1.45em] text-[#535F71] transition hover:bg-[#ECF1FA]"
      >
        <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: activeColor }} />
        {activeLabel}
        <span className="text-[10px] leading-none">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 flex w-[120px] flex-col gap-0.5 rounded-xl border border-[#E0E3E8] bg-white p-1.5 shadow-lg">
          {TEXT_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onPick(color.value);
                setOpen(false);
              }}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs leading-[1.45em] hover:bg-[#ECF1FA] ${
                color.value === activeColor ? "font-bold text-[#0053E0]" : "text-[#090909]"
              }`}
            >
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color.value }} />
              {color.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Uncontrolled contentEditable: renders its initial HTML once and never re-syncs
// from `value` afterwards, so React reconciliation never clobbers text the user
// is actively typing. Parent state still receives every change via onChange.
const EditableSurface = memo(
  function EditableSurface({
    initialHtml,
    onInput,
    placeholder,
    editorRef,
  }: {
    initialHtml: string;
    onInput: (html: string) => void;
    placeholder?: string;
    editorRef: React.RefObject<HTMLDivElement | null>;
  }) {
    return (
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onInput(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: initialHtml }}
        className="min-h-[120px] w-full resize-y rounded-b-lg px-4 py-3 text-sm leading-[1.6em] text-[#090909] outline-none empty:before:text-[#535F71] empty:before:content-[attr(data-placeholder)] [&_a]:text-[#0053E0] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
      />
    );
  },
  () => true // never re-render after mount; DOM owns its own content from here on
);

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [initialHtml] = useState(value);
  const [activeColor, setActiveColor] = useState(TEXT_COLORS[0].value);

  const ensureSelectionInEditor = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    const hasRangeInEditor =
      selection && selection.rangeCount > 0 && editor.contains(selection.getRangeAt(0).commonAncestorContainer);

    if (hasRangeInEditor) return;

    // No caret in the editor yet (e.g. toolbar clicked before ever focusing the
    // text area) — place one at the end so execCommand has something to act on.
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    ensureSelectionInEditor();
    document.execCommand(command, false, arg);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    const url = window.prompt("輸入連結網址");
    if (!url) return;

    editorRef.current?.focus();
    ensureSelectionInEditor();

    const selection = window.getSelection();
    const hasTextSelected = selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;

    if (!hasTextSelected) {
      // No text selected — createLink on a collapsed caret inserts an
      // invisible zero-width link, so insert visible link text instead.
      document.execCommand("insertHTML", false, `<a href="${url}">${url}</a>`);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
      return;
    }

    exec("createLink", url);
  };

  const insertList = (ordered: boolean) => {
    exec(ordered ? "insertOrderedList" : "insertUnorderedList");
  };

  return (
    <div className="flex flex-col rounded-lg border border-[#E0E3E8] bg-white">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E0E3E8] bg-[#FAFAFA] p-2">
        <div className="flex items-center gap-1.5">
          <select
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => exec("fontSize", String(FONT_SIZES.indexOf(e.target.value) + 2))}
            defaultValue="14 px"
            className="h-8 cursor-pointer rounded-[7px] border border-[#E0E3E8] bg-white px-2.5 text-xs leading-[1.45em] text-[#535F71] outline-none"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <TextColorPicker
            activeColor={activeColor}
            onPick={(color) => {
              setActiveColor(color);
              exec("foreColor", color);
            }}
          />
        </div>
        <div className="h-5 w-px bg-[#E0E3E8]" />
        <div className="flex items-center gap-1.5">
          <ToolbarButton label="B" onClick={() => exec("bold")} />
          <ToolbarButton label="I" onClick={() => exec("italic")} />
          <ToolbarButton label="U" onClick={() => exec("underline")} />
        </div>
        <div className="h-5 w-px bg-[#E0E3E8]" />
        <div className="flex items-center gap-1.5">
          <ToolbarButton label="• 清單" onClick={() => insertList(false)} />
          <ToolbarButton label="1. 清單" onClick={() => insertList(true)} />
        </div>
        <ToolbarButton label="連結" onClick={insertLink} />
      </div>

      <EditableSurface
        editorRef={editorRef}
        initialHtml={initialHtml}
        onInput={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
