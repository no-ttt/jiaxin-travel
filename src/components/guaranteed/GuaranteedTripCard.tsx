import Image from "next/image";
import Link from "next/link";
import { priceAffixes } from "@/lib/currency";
import type { PublicTripCard } from "@/lib/api/types/trip";

const detailLinkClass = "flex cursor-pointer items-center gap-1 text-[13px] font-medium text-[#002366]";

export default function GuaranteedTripCard({ trip }: { trip: PublicTripCard }) {
  const { prefix, suffix } = priceAffixes(trip.currency);
  const image = trip.cover ? (trip.cover.variants.card ?? trip.cover.url) : null;
  // Partner (external) trips have no detail page here; they open the partner's page instead.
  const isExternal = trip.trip_type === "external" && Boolean(trip.external_url);
  const detail = (
    <>
      詳情
      <Image src="/images/detail-arrow-icon.svg" alt="" width={5} height={8} />
    </>
  );

  return (
    <div className="flex w-full max-w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_10px_28px_0px_rgba(8,28,58,0.07)]">
      <div className="relative h-64 w-full shrink-0 bg-[#ECF1FA]">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={trip.product_name} className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 py-5">
        <h3 className="text-lg font-medium leading-6 text-[#1A1C1E]">{trip.product_name}</h3>
        <p className="text-sm leading-[1.6] text-[#5B6574]">{trip.description}</p>
      </div>
      <div className="flex items-center justify-between border-t border-[#C3C6D6] px-6 pb-5 pt-3">
        <div className="flex items-end gap-1">
          <span className="text-[13px] text-[#002366]">{prefix} </span>
          <span className="text-[25px] font-semibold leading-8 text-[#0053E0]">
            {trip.price_from != null ? trip.price_from.toLocaleString() : "—"}
          </span>
          <span className="text-[13px] text-[#002366]">{suffix}</span>
        </div>
        {isExternal ? (
          <a href={trip.external_url!} target="_blank" rel="noopener noreferrer" className={detailLinkClass}>
            {detail}
          </a>
        ) : (
          <Link href={`/trips/${encodeURIComponent(trip.trip_code)}`} className={detailLinkClass}>
            {detail}
          </Link>
        )}
      </div>
    </div>
  );
}
