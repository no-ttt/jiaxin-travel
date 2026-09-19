import Image from "next/image";
import type { TripDetail } from "./types";

export default function DecisionInfo({ trip }: { trip: TripDetail }) {
  return (
    <div className="flex flex-col gap-3 pb-10">
      <h1 className="font-serif text-xl font-semibold leading-[1.45] text-[#090909]">{trip.title}</h1>

      <div className="flex flex-col items-stretch gap-4 rounded-[18px] border border-[#E0E3E8] bg-white p-2.5 shadow-[0px_8px_24px_0px_rgba(5,18,36,0.05)] sm:flex-row sm:items-center">
        <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[272px] sm:w-[408px]">
          <Image src={trip.heroImage} alt={trip.title} fill className="object-cover" />
          <div className="absolute left-2.5 top-2.5 rounded-[10px] bg-[#002366] px-2 py-0.5">
            <span className="text-[13px] font-medium text-white">
              {trip.departureCity}出發：{trip.durationDays}天
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 py-2">
          <span className="text-[13px] tracking-wide text-[#535F71]">團號：{trip.groupCode}</span>

          <div className="flex flex-wrap items-center gap-1.5 py-1">
            {trip.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[14px] border border-[#E0E3E8] bg-[#ECF1FA] px-2.5 py-[3px] text-xs font-medium text-[#002366]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-1 rounded-[10px]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[15px] text-[#333]">{trip.startDate}</span>
                <span className="text-[15px] text-[#333]">{trip.departureCity}出發</span>
              </div>
              <div className="h-[18px] w-px bg-[#E0E3E8]" />
              <div className="flex items-center gap-1">
                <span className="text-[15px] text-[#333]">{trip.durationDays}</span>
                <span className="text-[15px] text-[#333]">天</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[15px] text-[#333]">訂金</span>
                <span className="text-[15px] text-[#333]">{trip.deposit}/人</span>
              </div>
              <div className="h-[18px] w-px bg-[#E0E3E8]" />
              {trip.guaranteedDeparture && (
                <span className="flex h-7 w-[78px] items-center justify-center rounded-[14px] border border-[#E0E3E8] bg-[#ECF1FA] text-[13px] font-medium text-[#0053E0]">
                  保證出團
                </span>
              )}
            </div>
          </div>

          <ul className="flex flex-col gap-0.5 pt-3">
            {trip.highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-1 text-[15px] text-[#333]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0053E0]" />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="flex flex-1 items-end justify-end gap-5 pr-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-base text-[#E85B20]">$</span>
              <span className="text-[26px] font-semibold text-[#E85B20]">{trip.price}</span>
              <span className="text-base text-[#E85B20]">售價</span>
            </div>
            <a
              href={`/contact?tripId=${trip.id}`}
              className="flex h-10 w-[120px] cursor-pointer items-center justify-center rounded-[10px] bg-[#0053E0] text-sm font-medium text-white transition hover:bg-[#0044b8]"
            >
              立即洽詢
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
