import type { ContractPage } from "@/lib/api/types/cms";
import { generateId } from "../ui/generateId";

export type PageIntro = {
  pageTitle: string;
  description: string;
};

export type ContractDocument = {
  documentTitle: string;
  linkText: string;
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
    contractDocument: { documentTitle: doc.doc_title, linkText: doc.doc_link_text, fileUrl: doc.doc_url },
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
  const urlChanged = contractDocument.fileUrl !== base.doc_url;
  return {
    ...base,
    page_title: pageIntro.pageTitle,
    intro_html: pageIntro.description,
    doc_title: contractDocument.documentTitle,
    doc_link_text: contractDocument.linkText,
    doc_url: contractDocument.fileUrl,
    // An uploaded file wins over doc_url, so a hand-edited URL must drop it to take effect.
    doc_media_id: urlChanged ? null : base.doc_media_id,
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
