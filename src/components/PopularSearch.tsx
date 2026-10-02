import Image from "next/image";
import Link from "next/link";
import { buildSearchHref } from "@/components/search/searchUrl";

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export default function PopularSearch({ keywords }: { keywords: string[] }) {
  const rows = chunk(keywords, 4);

  return (
    <div className="flex items-stretch gap-6 overflow-hidden rounded-3xl bg-white pl-8 shadow-[4px_4px_40px_0px_rgba(24,72,150,0.15)]">
      <div className="flex w-full max-w-[652px] flex-col gap-5 py-6">
        <div className="flex items-center gap-2">
          <Image src="/images/bolt-icon.svg" alt="" width={24} height={24} />
          <h2 className="text-lg font-medium uppercase text-black">熱門快搜</h2>
        </div>

        {rows.length > 0 ? (
          <div className="flex flex-col gap-6">
            {rows.map((row, i) => (
              <div key={i} className="flex flex-wrap items-center gap-6">
                {row.map((label, j) => (
                  <Link
                    key={`${label}-${i}-${j}`}
                    href={buildSearchHref({ keyword: label })}
                    className="cursor-pointer whitespace-nowrap rounded-2xl px-3 py-1 text-base uppercase text-black transition hover:bg-slate-100"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <span className="text-sm text-[#94969C]">尚無熱門搜尋關鍵字</span>
        )}
      </div>

      <div className="relative hidden min-h-[260px] flex-1 sm:block">
        <Image
          src="/images/popular-search.png"
          alt=""
          fill
          sizes="(min-width: 640px) 40vw, 0px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
