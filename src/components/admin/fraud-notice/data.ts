import type { FraudNoticePage } from "@/lib/api/types/cms";
import { generateId } from "../ui/generateId";

export type PageIntro = {
  pageTitle: string;
  description: string;
};

export type FraudNoticeClause = {
  id: string;
  title: string;
  content: string;
};

export type EditableFraudNotice = {
  pageIntro: PageIntro;
  clauses: FraudNoticeClause[];
};

export function toEditableFraudNotice(doc: FraudNoticePage): EditableFraudNotice {
  return {
    pageIntro: { pageTitle: doc.page_title, description: doc.intro_html },
    clauses: doc.sections.map((section) => ({
      id: generateId("clause"),
      title: section.title,
      content: section.body_html,
    })),
  };
}

/** `base` is the server copy; fields the editor doesn't know about are kept as they are. */
export function fromEditableFraudNotice(draft: EditableFraudNotice, base: FraudNoticePage): FraudNoticePage {
  return {
    ...base,
    page_title: draft.pageIntro.pageTitle,
    intro_html: draft.pageIntro.description,
    sections: draft.clauses.map((clause, i) => ({
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

export function isSameFraudNotice(a: FraudNoticePage, b: FraudNoticePage): boolean {
  return stableStringify(a) === stableStringify(b);
}
