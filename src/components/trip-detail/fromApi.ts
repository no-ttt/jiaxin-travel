import type { Media } from "@/lib/api/types/media";
import type { PublicTripDetail } from "@/lib/api/types/trip";
import { getTripDetail } from "./data";
import type { DayPlan, FlightLeg, TripDetail } from "./types";

/** Day badge is a 96×96 box: the design uses "05/29" + "Fri". */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "2027-01-13" → "01/13" */
const monthDay = (iso: string | null) => (iso ? iso.slice(5).replace("-", "/") : "");

const mediaUrl = (media: Media | null | undefined, variant?: "hero" | "card") =>
  media ? ((variant && media.variants[variant]) || media.url) : null;

/** "2027-01-13" → "2027/01/13" */
const slashDate = (iso: string | null) => (iso ? iso.replaceAll("-", "/") : "");

/** "阿聯酋航空 EK367" → { airline: "阿聯酋航空", flightNumber: "EK367" }; unmatched text stays as airline. */
function splitAirlineFlight(text: string): { airline: string; flightNumber: string } {
  const match = text.trim().match(/^(.*?)\s*([A-Z0-9]{2}\s?\d{1,4}[A-Z]?)$/);
  return match && match[1]
    ? { airline: match[1], flightNumber: match[2].replace(/\s/g, "") }
    : { airline: text.trim(), flightNumber: "" };
}

function toFlights(api: PublicTripDetail): FlightLeg[] {
  const flights = api.flights ?? [];
  const firstDate = flights[0]?.flight_date;
  const lastDate = flights.at(-1)?.flight_date;
  // The admin has no outbound/return field: legs flown on the last flight date (when it
  // differs from the first) are the return trip. An explicit leg_label wins if present.
  const isReturn = (date: string | null) =>
    Boolean(date && lastDate && firstDate && lastDate !== firstDate && date === lastDate);

  return flights.map((flight, index) => ({
    direction:
      flight.leg_label === "回程" || flight.leg_label === "去程"
        ? flight.leg_label
        : isReturn(flight.flight_date) || (index > 0 && index === flights.length - 1 && !firstDate)
          ? "回程"
          : "去程",
    date: slashDate(flight.flight_date),
    ...splitAirlineFlight(flight.airline_flight),
    departTime: flight.depart_time?.slice(0, 5) ?? "",
    departCity: flight.depart_city,
    arriveTime: flight.arrive_time?.slice(0, 5) ?? "",
    arriveCity: flight.arrive_city,
    nextDay: flight.day_offset > 0,
  }));
}

function toDays(api: PublicTripDetail): DayPlan[] {
  return (api.days ?? []).map((day) => ({
    date: monthDay(day.date),
    day: day.day_number,
    weekday: day.date ? WEEKDAYS[new Date(`${day.date}T00:00:00`).getDay()] : "",
    // Points have no type (visit/photo/pass) in the API yet; show them all as visits.
    stops: day.points.map((name) => ({ name, type: "visit" as const })),
    meals: day.meals,
    // Lodging is one text field; "A 或 B 或同級" is shown as options joined by 或 (as designed).
    hotelOptions: day.lodging
      .split(/\s*或\s*/)
      .map((option) => option.trim())
      .filter(Boolean),
    description: day.description,
    image: mediaUrl(day.images[0]?.media, "card") ?? "",
  }));
}

/**
 * Maps GET /public/trips/{code} onto the detail page's view model. Sections the API has no
 * data for yet (highlights list, more features, specs, spec gallery, built-in reminders)
 * keep the mock content, as agreed until the backend adds those fields.
 */
export function toTripDetail(api: PublicTripDetail): TripDetail {
  const mock = getTripDetail(api.trip_code);
  return {
    ...mock,
    id: api.trip_code,
    title: api.product_name,
    coverHeadline: api.cover_headline,
    seoTitle: api.seo.title,
    groupCode: api.trip_code,
    heroImage: mediaUrl(api.cover, "hero") ?? mock.heroImage,
    durationDays: api.duration_days ?? 0,
    departureCity: api.image_summary?.split("出發")[0] || mock.departureCity,
    tags: api.service_tags,
    startDate: slashDate(api.departure_date),
    deposit: api.deposit_per_person != null ? api.deposit_per_person.toLocaleString() : "—",
    guaranteedDeparture: api.status === "保證出團",
    price: api.price_from != null ? api.price_from.toLocaleString() : "—",
    currency: api.currency,
    flights: toFlights(api),
    flightNote: api.flight_note ?? "",
    featureBlocks: (api.feature_cards ?? []).map((card, index) => ({
      id: `feature-${index}`,
      title: card.title,
      paragraphs: [],
      bodyHtml: card.body_html,
      images: card.images.map((image) => mediaUrl(image.media, "card") ?? ""),
      caption: "",
      captions: card.images.map((image) => image.caption),
    })),
    // 更多特色／規格說明／規格圖庫 are just feature cards in the admin, so no extra mock sections.
    moreFeatures: [],
    specs: [],
    specGalleryImages: [],
    days: toDays(api),
    noticeTabs: (api.notice_tabs ?? []).map((tab) => ({ title: tab.title, bodyHtml: tab.body_html })),
    externalUrl: api.trip_type === "external" ? api.external_url : null,
  };
}
