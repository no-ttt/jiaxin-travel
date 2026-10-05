import type { ContractPage } from "@/lib/api/types/cms";
import { BODY_HTML_CLASS, INTRO_HTML_CLASS } from "./contentHtml";

export default function TravelContractContent({ page }: { page: ContractPage }) {
  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <h2 className="font-serif text-[28px] font-bold text-[#090909] sm:text-4xl">{page.page_title}</h2>
        <div className={INTRO_HTML_CLASS} dangerouslySetInnerHTML={{ __html: page.intro_html }} />
      </div>

      <div className="flex w-full flex-col gap-9 rounded-[22px] border border-[#E0E3E8] bg-white px-6 py-11 shadow-[0px_10px_28px_0px_rgba(5,20,41,0.05)] sm:px-12">
        <div className="flex flex-col gap-3.5">
          <h3 className="text-xl font-medium text-[#090909] sm:text-2xl">{page.doc_title}</h3>
          {page.doc_url && (
            <a
              href={page.doc_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-[15px] font-semibold text-[#0053E0] underline underline-offset-2"
            >
              {page.doc_link_text}
            </a>
          )}
        </div>

        {page.sections.map((section, index) => (
          <div key={index} className="flex flex-col gap-3.5">
            <div className="h-px w-full bg-[#E0E3E8]" />
            <h3 className="text-xl font-medium text-[#090909] sm:text-2xl">{section.title}</h3>
            <div className={BODY_HTML_CLASS} dangerouslySetInnerHTML={{ __html: section.body_html }} />
          </div>
        ))}
      </div>
    </div>
  );
}
