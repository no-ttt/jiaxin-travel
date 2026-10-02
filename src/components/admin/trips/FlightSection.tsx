"use client";

import { generateId } from "@/components/admin/ui/generateId";
import AdminDateField from "./AdminDateField";
import AdminSelect from "./AdminSelect";
import type { EditableFlightRow, EditableFlights } from "./content";

type FlightRow = EditableFlightRow;

const DAY_OFFSET_OPTIONS = [
  { value: 0, label: "當日" },
  { value: 1, label: "+1" },
];

const COLUMN_WIDTHS = {
  date: "w-[150px]",
  flight: "w-[180px]",
  time: "w-[90px]",
  city: "w-[110px]",
  overnight: "w-[80px]",
  arriveCity: "w-[150px]",
};

function CellInput({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  className: string;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-9 rounded-lg border border-transparent bg-transparent px-2 text-sm font-medium leading-[1.45em] text-[#090909] outline-none placeholder:text-[#B4BED1] hover:border-[#E0E3E8] focus:border-[#0053E0] focus:bg-white ${className}`}
    />
  );
}

export default function FlightSection({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: EditableFlights;
  onChange: (updater: (prev: EditableFlights) => EditableFlights) => void;
}) {
  const { note, rows: flights } = value;
  const setNote = (next: string) => onChange((prev) => ({ ...prev, note: next }));
  const setFlights = (updater: (prev: FlightRow[]) => FlightRow[]) =>
    onChange((prev) => ({ ...prev, rows: updater(prev.rows) }));

  const updateFlight = (id: string, patch: Partial<FlightRow>) => {
    setFlights((prev) => prev.map((f) => (f._id === id ? { ...f, ...patch } : f)));
  };

  const removeFlight = (id: string) => {
    setFlights((prev) => prev.filter((f) => f._id !== id));
  };

  const addFlight = () => {
    setFlights((prev) => [
      ...prev,
      {
        _id: generateId("flight"),
        flight_date: "",
        airline_flight: "",
        depart_time: "",
        depart_city: "",
        arrive_time: "",
        day_offset: 0,
        arrive_city: "",
        leg_label: null,
      },
    ]);
  };

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-[#E0E3E8] bg-white p-6">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold leading-[1.45em] text-[#090909]">{title}</h2>
          <span className="rounded-full bg-[#ECF1FA] px-2 py-[3px] text-[11px] font-bold leading-[1.45em] text-[#0053E0]">
            僅自建行程適用
          </span>
        </div>
        <p className="text-[13px] font-medium leading-[1.45em] text-[#535F71]">{description}</p>
      </div>

      <div className="flex flex-col gap-[7px]">
        <span className="text-sm font-bold leading-[1.45em] text-[#090909]">航程備註</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-[#E0E3E8] bg-white px-3.5 py-3 text-sm font-medium leading-[1.55em] text-[#090909] outline-none focus:border-[#0053E0]"
        />
      </div>

      <div className="w-full overflow-x-auto rounded-[10px] border border-[#E0E3E8]">
        <div className="min-w-[980px]">
          <div className="flex items-center gap-2 bg-[#F6F6F6] px-3 py-0">
            <span className={`flex h-11 items-center text-[13px] font-bold leading-[1.45em] text-[#535F71] ${COLUMN_WIDTHS.date}`}>
              航班日期
            </span>
            <span className={`flex h-11 items-center text-[13px] font-bold leading-[1.45em] text-[#535F71] ${COLUMN_WIDTHS.flight}`}>
              航空公司及航班
            </span>
            <span className={`flex h-11 items-center text-[13px] font-bold leading-[1.45em] text-[#535F71] ${COLUMN_WIDTHS.time}`}>
              起飛
            </span>
            <span className={`flex h-11 items-center text-[13px] font-bold leading-[1.45em] text-[#535F71] ${COLUMN_WIDTHS.city}`}>
              起飛城市
            </span>
            <span className={`flex h-11 items-center text-[13px] font-bold leading-[1.45em] text-[#535F71] ${COLUMN_WIDTHS.time}`}>
              抵達
            </span>
            <span className={`flex h-11 items-center text-[13px] font-bold leading-[1.45em] text-[#535F71] ${COLUMN_WIDTHS.overnight}`}>
              跨日
            </span>
            <span className={`flex h-11 items-center text-[13px] font-bold leading-[1.45em] text-[#535F71] ${COLUMN_WIDTHS.arriveCity}`}>
              抵達城市
            </span>
            <span className="flex h-11 flex-1 items-center justify-center text-[13px] font-bold leading-[1.45em] text-[#535F71]">
              刪除
            </span>
          </div>

          {flights.length === 0 && (
            <div className="flex items-center justify-center border-t border-[#E0E3E8] px-4 py-8">
              <span className="text-sm font-medium leading-[1.45em] text-[#535F71]">尚未新增航班</span>
            </div>
          )}

          {flights.map((flight) => (
            <div key={flight._id} className="flex items-center gap-2 border-t border-[#E0E3E8] px-3 py-2">
              <div className={COLUMN_WIDTHS.date}>
                <AdminDateField
                  value={flight.flight_date}
                  onChange={(v) => updateFlight(flight._id, { flight_date: v })}
                  size="compact"
                />
              </div>
              <CellInput
                value={flight.airline_flight}
                onChange={(v) => updateFlight(flight._id, { airline_flight: v })}
                placeholder="長榮航空 BR087"
                className={COLUMN_WIDTHS.flight}
              />
              <CellInput
                value={flight.depart_time}
                onChange={(v) => updateFlight(flight._id, { depart_time: v })}
                placeholder="23:05"
                className={COLUMN_WIDTHS.time}
              />
              <CellInput
                value={flight.depart_city}
                onChange={(v) => updateFlight(flight._id, { depart_city: v })}
                placeholder="桃園 TPE"
                className={COLUMN_WIDTHS.city}
              />
              <CellInput
                value={flight.arrive_time}
                onChange={(v) => updateFlight(flight._id, { arrive_time: v })}
                placeholder="08:00"
                className={COLUMN_WIDTHS.time}
              />
              <div className={`shrink-0 ${COLUMN_WIDTHS.overnight}`}>
                <AdminSelect
                  size="compact"
                  ariaLabel="跨日"
                  options={DAY_OFFSET_OPTIONS.map((option) => option.label)}
                  value={flight.day_offset > 0 ? "+1" : "當日"}
                  onChange={(label) => updateFlight(flight._id, { day_offset: label === "+1" ? 1 : 0 })}
                />
              </div>
              <CellInput
                value={flight.arrive_city}
                onChange={(v) => updateFlight(flight._id, { arrive_city: v })}
                placeholder="巴黎 CDG"
                className={COLUMN_WIDTHS.arriveCity}
              />
              <div className="flex flex-1 items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeFlight(flight._id)}
                  aria-label="刪除航班"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#C71A1A] hover:bg-[#FDEDED]"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M1 1L13 13M13 1L1 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={addFlight}
        className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-[#DBE8FF] text-sm font-bold leading-[1.45em] text-[#0053E0] hover:bg-[#CBDCF9]"
      >
        ＋ 新增航班
      </button>
    </section>
  );
}
