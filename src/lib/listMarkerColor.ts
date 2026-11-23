/**
 * Bullets (::marker) take the <li>'s own color, but the editor's color tool only colors the text
 * inside the <li>, so bullets stayed black. These helpers copy the color of an item's first text
 * onto its <li>. The backend sanitizer drops `style` on <li>, so this runs when rendering, not saving.
 */

const COLOR_IN_STYLE = /(?:^|;)\s*color\s*:\s*([^;"]+)/i;

/** Live DOM version for the admin editor; call after every edit. */
export function syncListMarkerColors(root: HTMLElement) {
  root.querySelectorAll("li").forEach((li) => {
    const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.textContent?.trim() && node.parentElement?.closest("li") === li
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP,
    });
    let color = "";
    for (let el = walker.nextNode()?.parentElement ?? null; el && el !== li; el = el.parentElement) {
      color = el.style.color || el.getAttribute("color") || "";
      if (color) break;
    }
    if (color) li.style.color = color;
    else li.style.removeProperty("color");
  });
}

/** String version for saved HTML on the front end (works in Server Components). */
export function colorListMarkers(html: string): string {
  return html.replace(/<li>((?:\s*<(?:strong|b|em|i|u)>)*\s*<span style="([^"]*)")/gi, (match, rest: string, style: string) => {
    const color = style.match(COLOR_IN_STYLE)?.[1]?.trim();
    return color ? `<li style="color: ${color}">${rest}` : match;
  });
}
