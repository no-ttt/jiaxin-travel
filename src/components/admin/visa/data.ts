import type {
  VisaCountryItem,
  VisaDownload,
  VisaDownloadDoc,
  VisaNoticeDoc,
  VisaPassportItem,
  VisaRequiredDoc,
  VisaServiceDetail,
  VisaServices,
} from "@/lib/api/types/cms";
import { isBlankHtml, noticeDocsOf } from "@/components/visa/detail";
import { generateId } from "../ui/generateId";

/** Admin-side editable shapes: API rows plus a client-only `_id` for React keys. */
export type EditableDownload = VisaDownload & { _id: string };
export type EditableRequiredDoc = Omit<VisaRequiredDoc, "downloads"> & {
  _id: string;
  downloads: EditableDownload[];
};
export type EditableNoticeDoc = VisaNoticeDoc & { _id: string };
export type EditableDownloadDoc = Required<VisaDownloadDoc> & { _id: string };
export type EditableDetail = Omit<VisaServiceDetail, "required_docs" | "notice_title" | "notice_docs" | "downloads"> & {
  required_docs: EditableRequiredDoc[];
  notice_title: string;
  notice_docs: EditableNoticeDoc[];
  downloads: EditableDownloadDoc[];
};
export type EditablePassportItem = Omit<VisaPassportItem, "detail"> & { _id: string; detail: EditableDetail };
export type EditableVisaItem = Omit<VisaCountryItem, "detail"> & { _id: string; detail: EditableDetail };

/** Shared by both lists; the three table columns differ per list (see FieldConfig). */
export type EditableServiceItem = EditablePassportItem | EditableVisaItem;

export type EditableVisaServices = Omit<VisaServices, "passport_items" | "visa_items"> & {
  passport_items: EditablePassportItem[];
  visa_items: EditableVisaItem[];
};

export type FieldConfig<T> = { key: keyof T & string; label: string }[];

export const PASSPORT_FIELDS: FieldConfig<EditablePassportItem> = [
  { key: "validity", label: "效期" },
  { key: "working_days", label: "辦理天數" },
  { key: "fee", label: "代辦費用" },
];

export const VISA_FIELDS: FieldConfig<EditableVisaItem> = [
  { key: "validity", label: "效期／停留" },
  { key: "days_text", label: "辦理天數" },
  { key: "fee_text", label: "費用" },
];

/**
 * Fixed slots from the design: 需備資料 has 4 documents (the 3rd with 2 download links),
 * 辦證須知 has 2 documents, 文件下載 has 4 files (as in the drawer design).
 */
const REQUIRED_DOC_SLOTS = 4;
const LINKED_DOC_INDEX = 2;
const DOC_LINK_SLOTS = 2;
const NOTICE_DOC_SLOTS = 2;
const DOWNLOAD_SLOTS = 4;
const DEFAULT_NOTICE_TITLE = "辦證須知";

/** Pads with blank rows up to `count`; longer server lists are kept whole. */
function padTo<T>(items: T[], count: number, create: () => T): T[] {
  return [...items, ...Array.from({ length: Math.max(0, count - items.length) }, create)];
}

/** Drops unfilled slots so they are never saved (they are padded back in on load). */
function dropBlank<T>(items: T[], isBlank: (item: T) => boolean): T[] {
  return items.filter((item) => !isBlank(item));
}

const isBlankDownload = (file: VisaDownload) => !file.label.trim() && !file.url.trim() && !file.media_id;
const isBlankDoc = (doc: VisaRequiredDoc) =>
  !doc.title.trim() && isBlankHtml(doc.body_html) && doc.downloads.length === 0;
const isBlankNoticeDoc = (doc: VisaNoticeDoc) => !doc.title.trim() && isBlankHtml(doc.body_html);
const isBlankDownloadDoc = (file: Required<VisaDownloadDoc>) =>
  isBlankDownload(file) && !file.title.trim() && !file.description.trim();

const toEditableDownload = (file: VisaDownload): EditableDownload => ({ ...file, _id: generateId("download") });

function toEditableDetail(detail: VisaServiceDetail): EditableDetail {
  const docs = padTo(detail.required_docs, REQUIRED_DOC_SLOTS, () => ({ title: "", body_html: "", downloads: [] }));
  return {
    ...detail,
    required_docs: docs.map((doc, i) => ({
      ...doc,
      _id: generateId("doc"),
      downloads: (i === LINKED_DOC_INDEX ? padTo(doc.downloads, DOC_LINK_SLOTS, blankDownload) : doc.downloads).map(
        toEditableDownload
      ),
    })),
    notice_title: detail.notice_title ?? DEFAULT_NOTICE_TITLE,
    notice_docs: padTo(noticeDocsOf(detail), NOTICE_DOC_SLOTS, () => ({ title: "", body_html: "" })).map(
      (doc) => ({ ...doc, _id: generateId("notice") })
    ),
    downloads: padTo<VisaDownloadDoc>(detail.downloads, DOWNLOAD_SLOTS, blankDownload).map((file) => ({
      ...file,
      title: file.title ?? "",
      description: file.description ?? "",
      _id: generateId("download"),
    })),
  };
}

export function toEditableVisaServices(doc: VisaServices): EditableVisaServices {
  return {
    ...doc,
    passport_items: doc.passport_items.map((item) => ({
      ...item,
      _id: generateId("passport"),
      detail: toEditableDetail(item.detail),
    })),
    visa_items: doc.visa_items.map((item) => ({
      ...item,
      _id: generateId("visa"),
      detail: toEditableDetail(item.detail),
    })),
  };
}

function omitId<T extends { _id: string }>({ _id, ...rest }: T): Omit<T, "_id"> {
  void _id;
  return rest;
}

function fromEditableDetail(detail: EditableDetail): VisaServiceDetail {
  const docs: VisaRequiredDoc[] = detail.required_docs.map((doc) => ({
    ...omitId(doc),
    downloads: dropBlank(doc.downloads.map(omitId), isBlankDownload),
  }));
  return {
    ...detail,
    required_docs: dropBlank(docs, isBlankDoc),
    notice_docs: dropBlank(detail.notice_docs.map(omitId), isBlankNoticeDoc),
    downloads: dropBlank(detail.downloads.map(omitId), isBlankDownloadDoc),
  };
}

export function fromEditableVisaServices(draft: EditableVisaServices): VisaServices {
  return {
    ...draft,
    passport_items: draft.passport_items.map((item) => ({
      ...omitId(item),
      detail: fromEditableDetail(item.detail),
    })),
    visa_items: draft.visa_items.map((item) => ({
      ...omitId(item),
      detail: fromEditableDetail(item.detail),
    })),
  };
}

/** Key-order-insensitive serialization, so a re-built doc compares equal to the server copy. */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) =>
    val && typeof val === "object" && !Array.isArray(val)
      ? Object.fromEntries(Object.entries(val).sort(([a], [b]) => a.localeCompare(b)))
      : val
  );
}

export function isSameVisaServices(a: VisaServices, b: VisaServices): boolean {
  return stableStringify(a) === stableStringify(b);
}

/** The server copy as the editor would save it untouched (new fields filled in), for dirty checks. */
export const normalizeVisaServices = (doc: VisaServices): VisaServices =>
  fromEditableVisaServices(toEditableVisaServices(doc));

function blankDownload(): VisaDownload {
  return { label: "", url: "", media_id: null };
}

function createDetail(): EditableDetail {
  return toEditableDetail({
    required_docs_visible: true,
    required_docs_title: "需準備文件清單",
    required_docs: [],
    notice_visible: true,
    notice_html: "",
    downloads_visible: true,
    downloads: [],
  });
}

export function createPassportItem(): EditablePassportItem {
  return {
    _id: generateId("passport"),
    name: "",
    visible: true,
    validity: "",
    working_days: "",
    fee: "",
    detail: createDetail(),
  };
}

export function createVisaItem(): EditableVisaItem {
  return {
    _id: generateId("visa"),
    name: "",
    visible: true,
    validity: "",
    days_text: "",
    fee_text: "",
    detail: createDetail(),
  };
}
