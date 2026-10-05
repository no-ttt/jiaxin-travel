import type { FooterDoc } from "@/lib/api/types/cms";
import { generateId } from "../ui/generateId";

export type BrandInfo = {
  logoMediaId: string | null;
  nameZh: string;
  nameEn: string;
  legalInfo: string;
};

export type ContactInfo = {
  phone: string;
  email: string;
  address: string;
  lineUrl: string;
  facebookUrl: string;
  instagramUrl: string;
};

export type FooterLink = {
  id: string;
  label: string;
  url: string;
};

export type CopyrightInfo = {
  copyrightText: string;
  links: FooterLink[];
};

export type EditableFooter = {
  brandInfo: BrandInfo;
  contactInfo: ContactInfo;
  copyrightInfo: CopyrightInfo;
};

export function toEditableFooter(doc: FooterDoc): EditableFooter {
  return {
    brandInfo: {
      logoMediaId: doc.logo_media_id,
      nameZh: doc.brand_name_zh,
      nameEn: doc.brand_name_en,
      legalInfo: doc.legal_info,
    },
    contactInfo: {
      phone: doc.phone,
      email: doc.email,
      address: doc.address,
      lineUrl: doc.line_url ?? "",
      facebookUrl: doc.facebook_url ?? "",
      instagramUrl: doc.instagram_url ?? "",
    },
    copyrightInfo: {
      copyrightText: doc.copyright,
      links: doc.links.map((link) => ({ ...link, id: generateId("footer-link") })),
    },
  };
}

/** The site hides a social icon when its URL is null, so a cleared field is saved as null. */
const urlOrNull = (url: string) => url.trim() || null;

/** `base` is the server copy; fields the editor doesn't know about are kept as they are. */
export function fromEditableFooter(draft: EditableFooter, base: FooterDoc): FooterDoc {
  const { brandInfo, contactInfo, copyrightInfo } = draft;
  return {
    ...base,
    logo_media_id: brandInfo.logoMediaId,
    brand_name_zh: brandInfo.nameZh,
    brand_name_en: brandInfo.nameEn,
    legal_info: brandInfo.legalInfo,
    phone: contactInfo.phone,
    email: contactInfo.email,
    address: contactInfo.address,
    line_url: urlOrNull(contactInfo.lineUrl),
    facebook_url: urlOrNull(contactInfo.facebookUrl),
    instagram_url: urlOrNull(contactInfo.instagramUrl),
    copyright: copyrightInfo.copyrightText,
    links: copyrightInfo.links.map((link) => {
      const { id, ...rest } = link;
      void id;
      return rest;
    }),
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

export function isSameFooter(a: FooterDoc, b: FooterDoc): boolean {
  return stableStringify(a) === stableStringify(b);
}
