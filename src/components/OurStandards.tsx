import Image from "next/image";

export type Standard = {
  id: string;
  icon: string | null;
  title: string;
  description: string;
};

function StandardCard({ standard }: { standard: Standard }) {
  return (
    <div className="flex flex-1 flex-col items-stretch rounded-[20px] border border-[#E0E3E8] bg-white px-6 py-8 shadow-[0px_6px_20px_0px_rgba(0,35,102,0.06)]">
      <div className="flex flex-col items-center gap-5">
        {/* The uploaded icon is the design's whole 52×52 badge (circle included), so it fills the box. */}
        <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full bg-[#DBE8FF]">
          {standard.icon && <Image src={standard.icon} alt="" fill className="object-contain" />}
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-xl font-medium text-[#090909]">{standard.title}</h3>
          <p className="text-base leading-relaxed text-[#535F71]">{standard.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function OurStandards({ standards }: { standards: Standard[] }) {
  return (
    <section className="bg-[#F3F3F6] px-4 py-12 sm:px-8 lg:px-[120px]">
      <div className="flex flex-col items-stretch gap-16">
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-serif text-3xl font-bold text-[#1A1C1E] sm:text-[32px]">
            嘉新旅遊的堅持
          </h2>
          <div className="h-1 w-12 rounded-[20px] bg-[#0053E0]" />
        </div>
        {standards.length > 0 ? (
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
            {standards.map((standard) => (
              <StandardCard key={standard.id} standard={standard} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-[#B45309]">尚無品牌特色資料</p>
        )}
      </div>
    </section>
  );
}
