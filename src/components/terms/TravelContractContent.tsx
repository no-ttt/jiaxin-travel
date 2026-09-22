import {
  TRAVEL_CONTRACT_DOWNLOAD,
  TRAVEL_CONTRACT_FORMATION,
  TRAVEL_CONTRACT_HEADING,
  TRAVEL_CONTRACT_SIGNING,
  TRAVEL_CONTRACT_SUMMARY,
} from "./data";

function PolicySectionBlock({ title, body }: { title: string; body: string[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="h-px w-full bg-[#E0E3E8]" />
      <h3 className="text-xl font-medium text-[#090909] sm:text-2xl">{title}</h3>
      <div className="flex flex-col gap-1.5 text-[15px] leading-[1.85] text-[#535F71]">
        {body.map((line) => (
          <p key={line}>・{line}</p>
        ))}
      </div>
    </div>
  );
}

export default function TravelContractContent() {
  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <h2 className="font-serif text-[28px] font-bold text-[#090909] sm:text-4xl">
          {TRAVEL_CONTRACT_HEADING.title}
        </h2>
        <p className="text-sm leading-[1.65] text-[#535F71] sm:text-base">
          {TRAVEL_CONTRACT_HEADING.description}
        </p>
      </div>

      <div className="flex w-full flex-col gap-9 rounded-[22px] border border-[#E0E3E8] bg-white px-6 py-11 shadow-[0px_10px_28px_0px_rgba(5,20,41,0.05)] sm:px-12">
        <div className="flex flex-col gap-3.5">
          <h3 className="text-xl font-medium text-[#090909] sm:text-2xl">
            {TRAVEL_CONTRACT_DOWNLOAD.title}
          </h3>
          <a
            href={TRAVEL_CONTRACT_DOWNLOAD.href}
            className="text-[15px] font-semibold text-[#0053E0] underline underline-offset-2"
          >
            {TRAVEL_CONTRACT_DOWNLOAD.linkLabel}
          </a>
        </div>

        <PolicySectionBlock
          title={TRAVEL_CONTRACT_FORMATION.title}
          body={TRAVEL_CONTRACT_FORMATION.body}
        />

        <div className="flex flex-col gap-3.5">
          <div className="h-px w-full bg-[#E0E3E8]" />
          <h3 className="text-xl font-medium text-[#090909] sm:text-2xl">
            {TRAVEL_CONTRACT_SUMMARY.title}
          </h3>
          <div className="flex flex-col gap-5 text-[15px] leading-[1.85] text-[#535F71]">
            {TRAVEL_CONTRACT_SUMMARY.groups.map((group) => (
              <div key={group.heading} className="flex flex-col gap-1.5">
                <p className="font-medium text-[#090909]">{group.heading}</p>
                {group.items.map((item) => (
                  <p key={item}>・{item}</p>
                ))}
                {group.paragraph && <p>{group.paragraph}</p>}
              </div>
            ))}
          </div>
        </div>

        <PolicySectionBlock
          title={TRAVEL_CONTRACT_SIGNING.title}
          body={TRAVEL_CONTRACT_SIGNING.body}
        />
      </div>
    </div>
  );
}
