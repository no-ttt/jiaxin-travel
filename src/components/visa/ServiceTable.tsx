"use client";

import { useState } from "react";
import Image from "next/image";
import ServiceDetailDrawer from "./ServiceDetailDrawer";

export type ServiceRow = {
  id: string;
  item: string;
  validity: string;
  duration: string;
  fee: string;
};

type ServiceTableProps = {
  columns: [string, string, string, string, string];
  rows: ServiceRow[];
};

export default function ServiceTable({ columns, rows }: ServiceTableProps) {
  const [itemLabel, validityLabel, durationLabel, feeLabel, detailLabel] = columns;
  const [selectedRow, setSelectedRow] = useState<ServiceRow | null>(null);

  return (
    <>
      <div className="w-full overflow-x-auto rounded-[18px] border border-[#E0E3E8] bg-white">
        <div className="min-w-[720px]">
          <div className="flex h-[54px] items-center bg-[#ECF1FA] text-[13px] font-medium text-[#090909]">
            <div className="flex-[2] px-[18px]">{itemLabel}</div>
            <div className="w-[150px] shrink-0 px-[18px] text-center">{validityLabel}</div>
            <div className="w-[190px] shrink-0 px-[18px] text-center">{durationLabel}</div>
            <div className="w-[180px] shrink-0 px-[18px] text-center">{feeLabel}</div>
            <div className="w-[200px] shrink-0 px-[18px] text-center">{detailLabel}</div>
          </div>

          {rows.map((row) => (
            <div
              key={row.id}
              className="flex h-16 items-center border-t border-[#E0E3E8] text-sm text-[#535F71]"
            >
              <div className="flex-[2] px-[18px] text-[#090909]">{row.item}</div>
              <div className="w-[150px] shrink-0 px-[18px] text-center">{row.validity}</div>
              <div className="w-[190px] shrink-0 px-[18px] text-center">{row.duration}</div>
              <div className="w-[180px] shrink-0 px-[18px] text-center">{row.fee}</div>
              <div className="flex w-[200px] shrink-0 justify-center px-[18px]">
                <button
                  type="button"
                  onClick={() => setSelectedRow(row)}
                  className="flex h-[38px] w-[126px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[#C3C6D6] bg-white text-[13px] font-medium text-[#0053E0] hover:bg-[#F5F8FF]"
                >
                  查看詳情
                  <Image src="/images/chevron-right-icon.svg" alt="" width={16} height={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ServiceDetailDrawer row={selectedRow} onClose={() => setSelectedRow(null)} />
    </>
  );
}
