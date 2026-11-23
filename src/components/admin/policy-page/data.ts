import type { PolicyPage } from "@/lib/api/types/cms";
import { generateId } from "../ui/generateId";

/** The design's default sections: they can be hidden but not removed; sections added after them can. */
export const DEFAULT_SECTION_COUNT = 4;
/** Backend limit (PolicyPageDoc.sections max_length). */
export const MAX_SECTIONS = 20;

export type PolicyIntro = {
  pageTitle: string;
  description: string;
};

export type PolicySectionDraft = {
  id: string;
  title: string;
  content: string;
  visible: boolean;
};

export type EditablePolicyPage = {
  intro: PolicyIntro;
  sections: PolicySectionDraft[];
};

export function toEditablePolicyPage(doc: PolicyPage): EditablePolicyPage {
  return {
    intro: { pageTitle: doc.page_title ?? "", description: doc.intro_html ?? "" },
    sections: (doc.sections ?? []).map((section) => ({
      id: generateId("section"),
      title: section.title,
      content: section.body_html,
      visible: section.visible ?? true,
    })),
  };
}

export function fromEditablePolicyPage(draft: EditablePolicyPage): PolicyPage {
  return {
    page_title: draft.intro.pageTitle,
    intro_html: draft.intro.description,
    sections: draft.sections.map((section) => ({
      title: section.title,
      body_html: section.content,
      visible: section.visible,
    })),
  };
}

export function newPolicySection(): PolicySectionDraft {
  return { id: generateId("section"), title: "", content: "", visible: true };
}

/** Key-order-insensitive serialization, so a re-built doc compares equal to the server copy. */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) =>
    val && typeof val === "object" && !Array.isArray(val)
      ? Object.fromEntries(Object.entries(val).sort(([a], [b]) => a.localeCompare(b)))
      : val
  );
}

export function isSamePolicyPage(a: PolicyPage, b: PolicyPage): boolean {
  return stableStringify(a) === stableStringify(b);
}

/** The server copy as the editor would save it untouched (missing `visible` filled in), for dirty checks. */
export const normalizePolicyPage = (doc: PolicyPage): PolicyPage =>
  fromEditablePolicyPage(toEditablePolicyPage(doc));
