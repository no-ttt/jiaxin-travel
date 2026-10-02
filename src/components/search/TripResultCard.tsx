import Image from "next/image";
import Link from "next/link";
import { priceAffixes } from "@/lib/currency";

export type TripResult = {
  /** Trip code — the detail page route segment. */
  id: string;
  image: string | null;
  title: string;
  description: string;
  price: string;
  currency?: string | null;
  /** External-link trips open the partner site in a new tab. */
  externalUrl?: string | null;
};

export default function TripResultCard({ trip }: { trip: TripResult }) {
  const { prefix, suffix } = priceAffixes(trip.currency);
  return (
    <div className="flex overflow-hidden rounded-2xl bg-white shadow-[0px_10px_28px_0px_rgba(8,28,58,0.07)]">
      <div className="relative h-64 w-[360px] shrink-0">
        {trip.image ? (
          <Image src={trip.image} alt={trip.title} fill sizes="360px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#E0E3E8] text-sm text-[#94969C]">
            無圖片
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-8 p-6">
        <div className="flex flex-1 flex-col gap-3">
          <h3 className="text-xl font-medium text-[#1A1C1E]">{trip.title}</h3>
          <p className="text-sm leading-relaxed text-[#5B6574]">{trip.description}</p>
        </div>
        <div className="flex items-center justify-between border-t border-[#C3C6D6] pt-3">
          <div className="flex items-end gap-1">
            <span className="text-[13px] text-[#002366]">{prefix} </span>
            <span className="text-[25px] font-semibold leading-8 text-[#0053E0]">{trip.price}</span>
            <span className="text-[13px] text-[#002366]">{suffix}</span>
          </div>
          {trip.externalUrl ? (
            <a
              href={trip.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer items-center gap-1 text-[13px] font-medium text-[#002366]"
            >
              查看行程
              <Image src="/images/detail-arrow-icon.svg" alt="" width={5} height={8} />
            </a>
          ) : (
            <Link
              href={`/trips/${encodeURIComponent(trip.id)}`}
              className="flex cursor-pointer items-center gap-1 text-[13px] font-medium text-[#002366]"
            >
              查看行程
              <Image src="/images/detail-arrow-icon.svg" alt="" width={5} height={8} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
