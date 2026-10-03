import Link from "next/link";
import { priceAffixes } from "@/lib/currency";
import type { PublicTripCard } from "@/lib/api/types/trip";

const cardClass =
  "flex w-full flex-col overflow-hidden rounded-2xl bg-[#14111A] shadow-[0px_10px_28px_0px_rgba(8,28,58,0.07)]";

export default function ThemeTripCard({ trip }: { trip: PublicTripCard }) {
  const { prefix, suffix } = priceAffixes(trip.currency);
  const image = trip.cover ? (trip.cover.variants.card ?? trip.cover.url) : null;

  const body = (
    <>
      <div className="relative h-64 w-full shrink-0 bg-[#292433]">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={trip.product_name} className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
      <div className="flex min-h-[200px] flex-1 flex-col px-6 py-5">
        <div className="flex flex-1 flex-col gap-3 pb-6">
          <h3 className="text-lg font-medium leading-6 text-white">{trip.product_name}</h3>
          <p className="text-sm leading-[1.6] text-[#A29DB0]">{trip.description}</p>
        </div>
        <div className="flex items-center justify-between border-t border-[#292433] pt-3">
        <div className="flex items-end gap-1">
          <span className="text-[13px] text-[#14D7B6]">{prefix} </span>
          <span className="text-[25px] font-semibold leading-8 text-white">
            {trip.price_from != null ? trip.price_from.toLocaleString() : "—"}
          </span>
          <span className="text-[13px] text-[#14D7B6]">{suffix}</span>
          </div>
        </div>
      </div>
    </>
  );

  // Partner (external) trips have no detail page here; they open the partner's page instead.
  if (trip.trip_type === "external" && trip.external_url) {
    return (
      <a href={trip.external_url} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {body}
      </a>
    );
  }
  return (
    <Link href={`/trips/${encodeURIComponent(trip.trip_code)}`} className={cardClass}>
      {body}
    </Link>
  );
}
