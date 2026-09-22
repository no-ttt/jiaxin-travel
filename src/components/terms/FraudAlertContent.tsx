import {
  FRAUD_ALERT_HEADING,
  FRAUD_ALERT_SECTIONS,
  FRAUD_ALERT_SUMMARY,
} from "./data";

export default function FraudAlertContent() {
  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <h2 className="font-serif text-[28px] font-bold text-[#090909] sm:text-4xl">
          {FRAUD_ALERT_HEADING.title}
        </h2>
        <p className="text-sm leading-[1.65] text-[#535F71] sm:text-base">
          {FRAUD_ALERT_HEADING.description}
        </p>
      </div>

      <div className="flex w-full flex-col gap-9 rounded-[22px] border border-[#E0E3E8] bg-white px-6 py-11 shadow-[0px_10px_28px_0px_rgba(5,20,41,0.05)] sm:px-12">
        {FRAUD_ALERT_SECTIONS.map((section, index) => (
          <div key={section.title} className="flex flex-col gap-3.5">
            {index > 0 && <div className="h-px w-full bg-[#E0E3E8]" />}
            <h3 className="text-xl font-medium text-[#090909] sm:text-2xl">{section.title}</h3>
            <div className="flex flex-col gap-4 text-[15px] leading-[1.85] text-[#535F71]">
              {section.paragraph && <p>{section.paragraph}</p>}
              {section.groups?.map((group) => (
                <div key={group.heading} className="flex flex-col gap-1">
                  <p className="font-medium text-[#090909]">{group.heading}</p>
                  <p>{group.paragraph}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-3.5">
          <div className="h-px w-full bg-[#E0E3E8]" />
          <h3 className="text-xl font-medium text-[#090909] sm:text-2xl">
            {FRAUD_ALERT_SUMMARY.title}
          </h3>
          <p className="text-[15px] leading-[1.85] text-[#535F71]">
            ・{FRAUD_ALERT_SUMMARY.paragraph}
          </p>
        </div>
      </div>
    </div>
  );
}
