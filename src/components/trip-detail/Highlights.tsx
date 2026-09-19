import ImageCarousel from "./ImageCarousel";
import type { FeatureBlock, SpecItem, TripDetail } from "./types";

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-7 rounded-[18px] border border-[#E0E3E8] bg-white px-6 py-6 shadow-[0px_10px_28px_0px_rgba(5,20,41,0.06)] sm:px-10">
      {children}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-3 w-3 shrink-0 rounded-sm bg-[#0053E0]" />
      <h3 className="whitespace-nowrap text-base font-medium text-[#002366]">{title}</h3>
      <span className="h-px flex-1 bg-[#E0E3E8]" />
    </div>
  );
}

function FeatureCard({ block }: { block: FeatureBlock }) {
  return (
    <SectionCard>
      <SectionHeader title={block.title} />
      <div className="flex flex-col gap-5">
        {block.paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-line text-sm leading-[1.75] text-[#535F71]">
            {p}
          </p>
        ))}
      </div>
      <ImageCarousel images={block.images} caption={block.caption} />
    </SectionCard>
  );
}

function SpecCard({ specs, galleryImages }: { specs: SpecItem[]; galleryImages: string[] }) {
  return (
    <SectionCard>
      <SectionHeader title="規格說明" />
      <div className="flex flex-col gap-5">
        {specs.map((spec, i) => (
          <div key={spec.id} className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center rounded-full border border-[#E0E3E8] bg-[#ECF1FA] px-3 py-[5px]">
              <span className="text-sm font-bold text-[#002366]">{spec.title}</span>
            </span>
            <p className="whitespace-pre-line text-sm leading-[2] text-[#535F71]">{spec.description}</p>
            {i < specs.length - 1 && <div className="h-px w-full bg-[#E0E3E8]" />}
          </div>
        ))}
      </div>
      <ImageCarousel images={galleryImages} caption="含導覽耳機／圖片僅供行程內容說明。" />
    </SectionCard>
  );
}

export default function Highlights({ trip }: { trip: TripDetail }) {
  return (
    <section id="highlights" className="flex scroll-mt-28 flex-col gap-5 py-10">
      <h2 className="font-serif text-2xl font-bold text-[#090909]">行程特色</h2>

      {trip.featureBlocks.map((block) => (
        <FeatureCard key={block.id} block={block} />
      ))}

      <SectionCard>
        <SectionHeader title="更多特色" />
        <p className="whitespace-pre-line text-base leading-[2] text-[#535F71]">
          {trip.moreFeatures.map((f) => `  - ${f}`).join("\n")}
        </p>
      </SectionCard>

      <SpecCard specs={trip.specs} galleryImages={trip.specGalleryImages} />
    </section>
  );
}
