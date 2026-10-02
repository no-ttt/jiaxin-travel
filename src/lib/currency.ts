/**
 * Price affixes per the design: "TWD 20,000 元起", where the unit before 起 is exactly the
 * admin's 幣別 field as returned by the API (no defaults or conversion).
 */
export function priceAffixes(currency: string | null | undefined): { prefix: string; suffix: string } {
  return { prefix: "TWD", suffix: `${(currency ?? "").trim()}起` };
}
