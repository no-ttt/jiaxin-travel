"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32].map((px) => ({ value: `${px}px`, label: `${px} px` }));
const DEFAULT_FONT_SIZE = "14px";
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
  active = false,
}: {
  label: string;
  onClick: () => void;
  /** The caret / selection already has this format. */
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border px-2.5 text-xs leading-[1.45em] transition ${
        active
          ? "border-[#0053E0] bg-[#ECF1FA] font-bold text-[#0053E0]"
          : "border-[#E0E3E8] bg-white text-[#535F71] hover:bg-[#ECF1FA]"
      }`}
    >
      {label}
    </button>
  );
}

type DropdownOption = { value: string; label: string };

/** Toolbar dropdown shared by 字級 and 文字顏色 (optional color swatch before each label). */
function ToolbarDropdown({
  options,
  value,
  onPick,
  swatch = false,
  fallbackLabel,
}: {
  options: DropdownOption[];
  value: string;
  onPick: (value: string) => void;
  swatch?: boolean;
  /** Label when the current text uses a value that is not one of the options. */
  fallbackLabel: (value: string) => string;
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

  const activeLabel = options.find((option) => option.value === value)?.label ?? fallbackLabel(value);
  const dot = (color: string) => (
    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border border-[#E0E3E8] bg-white px-2.5 text-xs leading-[1.45em] text-[#535F71] transition hover:bg-[#ECF1FA]"
      >
        {swatch && dot(value)}
        {activeLabel}
        <span className="text-[10px] leading-none">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 flex max-h-[280px] w-[120px] flex-col gap-0.5 overflow-y-auto rounded-xl border border-[#E0E3E8] bg-white p-1.5 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onPick(option.value);
                setOpen(false);
              }}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs leading-[1.45em] hover:bg-[#ECF1FA] ${
                option.value === value ? "font-bold text-[#0053E0]" : "text-[#090909]"
              }`}
            >
              {swatch && dot(option.value)}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * execCommand("fontSize") only knows levels 1–7, so a picked size is applied as level 7 and then
 * rewritten to its px value. Levels 2–5 are from the older 4-option editor (12–18 px).
 */
const PENDING_FONT_LEVEL = "7";
const LEGACY_FONT_SIZE_PX: Record<string, string> = { "2": "12px", "3": "14px", "4": "16px", "5": "18px" };

function fontToSpan(font: Element, fontSize: string | undefined): HTMLSpanElement {
  const span = document.createElement("span");
  const color = font.getAttribute("color");
  if (color) span.style.color = color;
  if (fontSize) span.style.fontSize = fontSize;
  span.append(...Array.from(font.childNodes));
  font.replaceWith(span);
  return span;
}

/** The size for text typed at a caret after picking one, kept on the editor element itself. */
const pendingFontSizeOf = (editor: HTMLElement) => editor.dataset.pendingFontSize ?? DEFAULT_FONT_SIZE;

/** Rewrites level-7 <font> tags in the live editor to px spans; returns the new spans. */
function applyPendingFontSize(editor: HTMLElement, fontSize: string): HTMLSpanElement[] {
  const spans: HTMLSpanElement[] = [];
  editor.querySelectorAll(`font[size="${PENDING_FONT_LEVEL}"]`).forEach((font) => {
    // Chrome also leaves empty <font> tags at the selection edges; drop them.
    if (!font.textContent) {
      font.remove();
      return;
    }
    const span = fontToSpan(font, fontSize);
    // The new size wins over sizes set earlier inside the same selection.
    span.querySelectorAll<HTMLElement>("[style*='font-size']").forEach((el) => (el.style.fontSize = ""));
    spans.push(span);
  });
  return spans;
}

/**
 * Rewrites the editor HTML into what the backend sanitizer keeps. It drops <div> and <font>
 * tags (keeping their text) but allows <p>, <br> and <span style="color|font-size">, while
 * browsers emit a <div> per line and <font color|size> for the color/size tools.
 */
function toSavedHtml(editor: HTMLElement, pendingFontSize: string): string {
  const clone = editor.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("div").forEach((div) => {
    const p = document.createElement("p");
    p.append(...Array.from(div.childNodes));
    div.replaceWith(p);
  });
  clone.querySelectorAll("font").forEach((font) => {
    const size = font.getAttribute("size");
    // Level 7 here is text typed at a collapsed caret after picking a size.
    fontToSpan(font, size === PENDING_FONT_LEVEL ? pendingFontSize : size ? LEGACY_FONT_SIZE_PX[size] : undefined);
  });
  // Empty spans left by formatting commands carry no content.
  clone.querySelectorAll("span:empty").forEach((span) => span.remove());
  return clone.innerHTML;
}

type Formats = { bold: boolean; italic: boolean; underline: boolean; ul: boolean; ol: boolean; link: boolean };
const NO_FORMATS: Formats = { bold: false, italic: false, underline: false, ul: false, ol: false, link: false };

/**
 * A size / color picked at a collapsed caret only applies to the next typed text, so until the caret
 * moves the toolbar keeps showing the picked value instead of the surrounding text's.
 */
const pickedAtCaret = new WeakMap<HTMLElement, { node: Node; offset: number }>();

function rememberCaretPick(editor: HTMLElement) {
  const range = window.getSelection()?.getRangeAt(0);
  if (range?.collapsed) pickedAtCaret.set(editor, { node: range.startContainer, offset: range.startOffset });
  else pickedAtCaret.delete(editor);
}

const toHex = (rgb: string) => {
  const [r, g, b] = rgb.match(/\d+/g)?.map(Number) ?? [0, 0, 0];
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
};

/** The formatting of the content's first text, shown before the editor has ever had a caret. */
function readInitialToolbarState(editor: HTMLElement) {
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
  });
  const el = walker.nextNode()?.parentElement;
  if (!el) return null;
  const style = getComputedStyle(el);
  const link = el.closest("a");
  const inLink = Boolean(link && editor.contains(link));
  const within = (selector: string) => {
    const found = el.closest(selector);
    return Boolean(found && editor.contains(found));
  };
  return {
    fontSize: `${Math.round(parseFloat(style.fontSize))}px`,
    color: toHex(getComputedStyle(inLink && link?.parentElement ? link.parentElement : el).color),
    formats: {
      bold: Number(style.fontWeight) >= 600,
      italic: style.fontStyle === "italic",
      underline: within("u"),
      ul: within("ul"),
      ol: within("ol"),
      link: inLink,
    } satisfies Formats,
  };
}

/** The formatting at the caret / selection start, or null when the selection is outside `editor`. */
function readToolbarState(editor: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.startContainer)) return null;
  const node = range.startContainer;
  // A selection that starts between elements (e.g. right after resizing, it wraps the new span)
  // reads the format of the element it starts at, not of the surrounding paragraph.
  const startNode =
    node.nodeType === Node.TEXT_NODE || range.collapsed ? node : (node.childNodes[range.startOffset] ?? node);
  const el = startNode.nodeType === Node.TEXT_NODE ? startNode.parentElement : (startNode as Element);
  if (!el) return null;

  const picked = pickedAtCaret.get(editor);
  const keepPicked = range.collapsed && picked?.node === node && picked.offset === range.startOffset;
  if (!keepPicked) pickedAtCaret.delete(editor);
  const style = getComputedStyle(el);
  const link = el.closest("a");
  const inLink = Boolean(link && editor.contains(link));
  // Links are blue and underlined by the editor's CSS, not by the author: read the color from
  // outside the link and count only an explicit <u> as underline.
  const colorSource = inLink && link?.parentElement ? link.parentElement : el;
  return {
    fontSize: keepPicked ? null : `${Math.round(parseFloat(style.fontSize))}px`,
    color: keepPicked ? null : toHex(getComputedStyle(colorSource).color),
    formats: {
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: inLink ? Boolean(el.closest("u")) : document.queryCommandState("underline"),
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
      link: inLink,
    } satisfies Formats,
  };
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
    onInput: (editor: HTMLDivElement) => void;
    placeholder?: string;
    editorRef: React.RefObject<HTMLDivElement | null>;
  }) {
    return (
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onInput(e.currentTarget)}
        // New lines become <p> (not the browser-default <div>, which the backend strips).
        onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: initialHtml }}
        // Text typed after picking a size (level-7 <font>) shows at that size until saved as a span.
        className="min-h-[120px] w-full [&_font[size='7']]:[font-size:var(--pending-font-size)] resize-y rounded-b-lg px-4 py-3 text-sm leading-[1.6em] text-[#090909] outline-none empty:before:text-[#B4BED1] empty:before:content-[attr(data-placeholder)] [&_a]:text-[#0053E0] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
      />
    );
  },
  () => true // never re-render after mount; DOM owns its own content from here on
);

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [initialHtml] = useState(value);

  // EditableSurface never re-renders, so it must not hold on to the first render's onChange:
  // that closure carries the parent's state from mount time and would overwrite later edits.
  const onChangeRef = useRef(onChange);
  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });
  const handleInput = useCallback(
    (editor: HTMLDivElement) => onChangeRef.current(toSavedHtml(editor, pendingFontSizeOf(editor))),
    []
  );
  const [activeColor, setActiveColor] = useState(TEXT_COLORS[0].value);
  const [activeFontSize, setActiveFontSize] = useState(DEFAULT_FONT_SIZE);
  const [formats, setFormats] = useState<Formats>(NO_FORMATS);

  // Mirror the caret's formatting in the toolbar (size, color, B/I/U, lists, link). State setters
  // are stable, so the selectionchange listener can be registered once.
  const syncToolbar = useCallback((editor: HTMLElement) => {
    const state = readToolbarState(editor);
    if (!state) return;
    if (state.fontSize) setActiveFontSize(state.fontSize);
    if (state.color) setActiveColor(state.color);
    setFormats(state.formats);
  }, []);
  useEffect(() => {
    // Until the author puts a caret in, show the format the content starts with.
    const editor = editorRef.current;
    const initial = editor && readInitialToolbarState(editor);
    if (initial) {
      setActiveFontSize(initial.fontSize);
      setActiveColor(initial.color);
      setFormats(initial.formats);
    }
    const onSelectionChange = () => {
      if (editorRef.current) syncToolbar(editorRef.current);
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, [syncToolbar]);

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
    const editor = editorRef.current;
    if (!editor) return;
    if (command === "foreColor") rememberCaretPick(editor);
    syncToolbar(editor);
    onChange(toSavedHtml(editor, pendingFontSizeOf(editor)));
  };

  const applyFontSize = (fontSize: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    ensureSelectionInEditor();
    // Fix text typed at the previous size before level 7 is reused for the new one.
    applyPendingFontSize(editor, pendingFontSizeOf(editor));
    editor.dataset.pendingFontSize = fontSize;
    editor.style.setProperty("--pending-font-size", fontSize);
    document.execCommand("fontSize", false, PENDING_FONT_LEVEL);
    const spans = applyPendingFontSize(editor, fontSize);
    // Keep the resized text selected so color / bold can be applied to it next.
    if (spans.length > 0) {
      const range = document.createRange();
      range.setStartBefore(spans[0]);
      range.setEndAfter(spans[spans.length - 1]);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    rememberCaretPick(editor);
    syncToolbar(editor);
    onChange(toSavedHtml(editor, fontSize));
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
      if (editorRef.current) onChange(toSavedHtml(editorRef.current, pendingFontSizeOf(editorRef.current)));
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
          <ToolbarDropdown
            options={FONT_SIZES}
            value={activeFontSize}
            fallbackLabel={(px) => `${parseFloat(px)} px`}
            onPick={(fontSize) => {
              setActiveFontSize(fontSize);
              applyFontSize(fontSize);
            }}
          />
          <ToolbarDropdown
            options={TEXT_COLORS}
            value={activeColor}
            swatch
            fallbackLabel={() => "文字顏色"}
            onPick={(color) => {
              setActiveColor(color);
              exec("foreColor", color);
            }}
          />
        </div>
        <div className="h-5 w-px bg-[#E0E3E8]" />
        <div className="flex items-center gap-1.5">
          <ToolbarButton label="B" active={formats.bold} onClick={() => exec("bold")} />
          <ToolbarButton label="I" active={formats.italic} onClick={() => exec("italic")} />
          <ToolbarButton label="U" active={formats.underline} onClick={() => exec("underline")} />
        </div>
        <div className="h-5 w-px bg-[#E0E3E8]" />
        <div className="flex items-center gap-1.5">
          <ToolbarButton label="• 清單" active={formats.ul} onClick={() => insertList(false)} />
          <ToolbarButton label="1. 清單" active={formats.ol} onClick={() => insertList(true)} />
        </div>
        <ToolbarButton label="連結" active={formats.link} onClick={insertLink} />
      </div>

      <EditableSurface
        editorRef={editorRef}
        initialHtml={initialHtml}
        onInput={handleInput}
        placeholder={placeholder}
      />
    </div>
  );
}
