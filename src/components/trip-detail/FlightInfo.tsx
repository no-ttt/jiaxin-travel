import Image from "next/image";
import type { FlightLeg } from "./types";

function FlightRow({ flight, isFirstOfDirection }: { flight: FlightLeg; isFirstOfDirection: boolean }) {
  return (
    <tr className="border-t border-[#E0E3E8] first:border-t-0">
      <td className="h-12 w-[100px] px-2 text-center align-middle">
        {isFirstOfDirection && (
          <span className="inline-flex items-center gap-1">
            <Image src="/images/trip-detail/plane-icon.svg" alt="" width={16} height={16} />
            <span
              className={`flex h-7 w-12 items-center justify-center rounded-[14px] text-[13px] font-medium ${
                flight.direction === "去程" ? "bg-[#ECF1FA] text-[#002366]" : "bg-[#F6F6F6] text-[#535F71]"
              }`}
            >
              {flight.direction}
            </span>
          </span>
        )}
      </td>
      <td className="h-12 w-[156px] px-2 text-center align-middle text-[13px] font-medium text-[#090909]">
        {flight.date}
      </td>
      <td className="h-12 w-[170px] px-2 text-center align-middle">
        <span className="flex items-baseline justify-center gap-2">
          <span className="text-[13px] text-[#090909]">{flight.airline}</span>
          <span className="text-[13px] font-semibold text-[#535F71]">{flight.flightNumber}</span>
        </span>
      </td>
      <td className="h-12 w-[216px] px-2 text-center align-middle">
        <span className="flex items-center justify-center gap-2">
          <span className="text-base font-semibold text-[#090909]">{flight.departTime}</span>
          <span className="text-sm text-[#090909]">{flight.departCity}</span>
        </span>
      </td>
      <td className="h-12 w-[82px] px-2 text-center align-middle text-sm text-[#535F71]">→</td>
      <td className="h-12 w-[216px] px-2 text-center align-middle">
        <span className="flex items-center justify-center gap-2">
          <span className="text-base font-semibold text-[#090909]">{flight.arriveTime}</span>
          {flight.nextDay && (
            <span className="flex h-[22px] w-[30px] items-center justify-center rounded-[11px] bg-[#ECF1FA] text-xs font-medium text-[#0053E0]">
              ＋1
            </span>
          )}
          <span className="text-sm text-[#090909]">{flight.arriveCity}</span>
        </span>
      </td>
    </tr>
  );
}

export default function FlightInfo({ flights }: { flights: FlightLeg[] }) {
  return (
    <section id="flights" className="flex scroll-mt-28 flex-col gap-[18px] pt-10">
      <h2 className="font-serif text-2xl font-bold text-[#090909]">航程資訊</h2>
      <p className="flex h-[42px] items-center text-[13px] text-[#535F71]">
        以下為預定航班資訊；實際航班編號、飛行時間與機場安排仍以出團前最終確認為準。
      </p>

      <div className="overflow-x-auto rounded-[14px] bg-white shadow-[0px_8px_24px_0px_rgba(5,18,36,0.05)]">
        <table className="w-full min-w-[850px] border-collapse">
          <thead>
            <tr className="border-b border-[#E0E3E8] bg-[#ECF1FA]">
              <th className="h-[42px] w-[100px] text-center text-[13px] font-medium text-[#535F71]" />
              <th className="h-[42px] w-[156px] text-center text-[13px] font-medium text-[#535F71]">
                班機日期
              </th>
              <th className="h-[42px] w-[170px] text-center text-[13px] font-medium text-[#535F71]">
                航空公司／航班編號
              </th>
              <th className="h-[42px] w-[216px] text-center text-[13px] font-medium text-[#535F71]">
                起飛時間及城市
              </th>
              <th className="h-[42px] w-[82px]" />
              <th className="h-[42px] w-[216px] text-center text-[13px] font-medium text-[#535F71]">
                抵達時間及城市（跨日+1）
              </th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, i) => (
              <FlightRow
                key={`${flight.flightNumber}-${i}`}
                flight={flight}
                isFirstOfDirection={i === 0 || flights[i - 1].direction !== flight.direction}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
