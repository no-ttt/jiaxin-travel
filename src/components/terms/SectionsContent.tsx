import type { ContentPageSection } from "@/lib/api/types/cms";
import { BODY_HTML_CLASS, INTRO_HTML_CLASS } from "./contentHtml";
import { colorListMarkers } from "@/lib/listMarkerColor";

/** Title + intro + a card of titled sections: 取消／退訂規定、防詐騙提醒說明、聲明公告專區. */
export default function SectionsContent({
  page,
}: {
  page: { page_title: string; intro_html: string; sections: ContentPageSection[] };
}) {
  // A page still in an older backend format (e.g. 聲明公告專區 as `items`) has no sections yet.
  const sections = page.sections ?? [];
  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <h2 className="font-serif text-[28px] font-bold text-[#090909] sm:text-4xl">{page.page_title}</h2>
        <div
          className={INTRO_HTML_CLASS}
          dangerouslySetInnerHTML={{ __html: colorListMarkers(page.intro_html) }}
        />
      </div>

      {sections.length > 0 && (
        <div className="flex w-full flex-col gap-9 rounded-[22px] border border-[#E0E3E8] bg-white px-6 py-11 shadow-[0px_10px_28px_0px_rgba(5,20,41,0.05)] sm:px-12">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-3.5">
              {index > 0 && <div className="h-px w-full bg-[#E0E3E8]" />}
              <h3 className="text-xl font-medium text-[#090909] sm:text-2xl">{section.title}</h3>
              <div className={BODY_HTML_CLASS} dangerouslySetInnerHTML={{ __html: colorListMarkers(section.body_html) }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
