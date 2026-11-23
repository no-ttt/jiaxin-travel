import type { ContractPage } from "@/lib/api/types/cms";
import { generateId } from "../ui/generateId";

export type PageIntro = {
  pageTitle: string;
  description: string;
};

export type ContractDocument = {
  documentTitle: string;
  linkText: string;
  /** Uploaded contract file (served as the download link). */
  mediaId: string | null;
  /** A link saved before uploads (doc_url without a file); shown until a file replaces it. */
  fileUrl: string;
};

export type ContractClause = {
  id: string;
  title: string;
  content: string;
};

export type EditableContract = {
  pageIntro: PageIntro;
  contractDocument: ContractDocument;
  clauses: ContractClause[];
};

export function toEditableContract(doc: ContractPage): EditableContract {
  return {
    pageIntro: { pageTitle: doc.page_title, description: doc.intro_html },
    contractDocument: {
      documentTitle: doc.doc_title,
      linkText: doc.doc_link_text,
      mediaId: doc.doc_media_id ?? null,
      fileUrl: doc.doc_media_id ? "" : doc.doc_url,
    },
    clauses: doc.sections.map((section) => ({
      id: generateId("clause"),
      title: section.title,
      content: section.body_html,
    })),
  };
}

/** `base` is the server copy; fields the editor doesn't know about are kept as they are. */
export function fromEditableContract(draft: EditableContract, base: ContractPage): ContractPage {
  const { pageIntro, contractDocument, clauses } = draft;
  return {
    ...base,
    page_title: pageIntro.pageTitle,
    intro_html: pageIntro.description,
    doc_title: contractDocument.documentTitle,
    doc_link_text: contractDocument.linkText,
    // The uploaded file is the download; doc_url only keeps an older plain link until it's replaced.
    doc_media_id: contractDocument.mediaId,
    doc_url: contractDocument.mediaId ? "" : contractDocument.fileUrl,
    sections: clauses.map((clause, i) => ({
      ...base.sections[i],
      title: clause.title,
      body_html: clause.content,
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

export function isSameContract(a: ContractPage, b: ContractPage): boolean {
  return stableStringify(a) === stableStringify(b);
}
