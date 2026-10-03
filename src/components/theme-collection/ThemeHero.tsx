import type { PublicCollection } from "@/lib/api/types/collection";
import { DEFAULT_BUTTON_COLOR, DEFAULT_THEME_COLOR } from "./colors";

/** Hero per the 主題集合頁 design: theme color as an 85% overlay on the hero image (or solid without one). */
export default function ThemeHero({
  collection,
  themeName,
}: {
  collection: PublicCollection;
  themeName: string | null;
}) {
  const themeColor = collection.theme_color ?? DEFAULT_THEME_COLOR;
  const heroUrl = collection.hero ? (collection.hero.variants.hero ?? collection.hero.url) : null;

  return (
    <div
      className="relative flex flex-col items-start gap-8 overflow-hidden border-b border-[#292433] bg-cover bg-center px-6 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-[100px] sm:pb-[60px] sm:pt-20"
      style={{ backgroundColor: themeColor, backgroundImage: heroUrl ? `url(${heroUrl})` : undefined }}
    >
      {heroUrl && <div className="absolute inset-0 opacity-85" style={{ backgroundColor: themeColor }} />}

      <div className="relative flex max-w-[720px] flex-col gap-4">
        <span className="text-[13px] font-bold tracking-[0.1538em] text-[#14D7B6]">
          主題旅遊{themeName ? `　/　${themeName}` : ""}
        </span>
        <h1 className="font-serif text-4xl font-black leading-tight text-white sm:text-[48px] sm:leading-[56px]">
          {collection.title}
        </h1>
        {collection.subtitle && (
          <p className="text-sm leading-[1.6] text-[#A29DB0] sm:text-base sm:leading-[26px]">{collection.subtitle}</p>
        )}
      </div>

      {collection.tag_text && (
        <div
          className="relative flex h-12 min-w-[184px] shrink-0 items-center justify-center rounded-xl px-5"
          style={{ backgroundColor: collection.button_color ?? DEFAULT_BUTTON_COLOR }}
        >
          <span className="text-[13px] font-medium leading-[1.4em] text-white">{collection.tag_text}</span>
        </div>
      )}
    </div>
  );
}
