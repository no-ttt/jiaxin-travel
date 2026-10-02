import type { Media } from "@/lib/api/types/media";
import type { TaxonomyOption } from "@/lib/api/types/taxonomy";
import type { PublicTripDetail, PublicTripImage } from "@/lib/api/types/trip";
import { toDaysPayload, toFlightsPayload, type EditableImage } from "./content";
import type { PreviewDraft } from "./preview-draft";

export type PreviewLookups = {
  /** Media records by id; images not loaded yet are left out until they arrive. */
  media: Map<string, Media>;
  statuses: TaxonomyOption[] | undefined;
  badges: TaxonomyOption[] | undefined;
};

/** Every media id the draft references (cover + feature card + day images). */
export function draftMediaIds({ form, content }: PreviewDraft): string[] {
  const ids = [
    form.cover_media_id,
    ...content.featureCards.flatMap((card) => card.images.map((image) => image.media_id)),
    ...content.days.flatMap((day) => day.images.map((image) => image.media_id)),
  ];
  return [...new Set(ids.filter((id): id is string => Boolean(id)))];
}

/** "2027-01-13" + 2 → "2027-01-15" (UTC, so no timezone shift). */
function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Builds the GET /public/trips/{code} shape from the editor's unsaved draft, so the preview
 * goes through the same `toTripDetail` + `TripDetailView` as the live trip page. Flights and
 * days reuse the save payload builders, so blank times / empty points are dropped as on save.
 */
export function toPreviewTrip(draft: PreviewDraft, lookups: PreviewLookups): PublicTripDetail {
  const { form, content } = draft;
  const isExternal = form.tripType === "external";
  const nameOf = (options: TaxonomyOption[] | undefined, id: number | null) =>
    options?.find((option) => option.id === id)?.name ?? null;
  const toImages = (images: EditableImage[]): PublicTripImage[] =>
    images.flatMap((image) => {
      const media = lookups.media.get(image.media_id);
      return media ? [{ media, caption: image.caption }] : [];
    });

  const flights = toFlightsPayload(content.flights);
  const days = toDaysPayload(content.days);
  const imageSummary = form.image_summary_visible && form.default_origin ? `${form.default_origin}出發` : null;

  return {
    trip_code: draft.tripCode,
    trip_type: form.tripType,
    product_name: form.product_name,
    description: form.product_description,
    cover: (form.cover_media_id && lookups.media.get(form.cover_media_id)) || null,
    price_from: form.price_from,
    currency: form.currency,
    duration_days: form.duration_days,
    badge: form.badge_mode === "custom" ? nameOf(lookups.badges, form.badge_id) : null,
    status: nameOf(lookups.statuses, form.status_id),
    image_summary: imageSummary,
    external_url: isExternal ? form.external_url : null,
    seo: { title: form.seo_title, description: "", og_image: null },
    service_tags: form.service_tags_visible ? form.service_tags : [],
    cover_headline: form.cover_headline,
    departure_date: form.base_departure_date,
    deposit_per_person: form.deposit_per_person,
    cta: isExternal ? "external" : "inquiry",
    publish_status: form.publish_status,
    // External trips have no flights / features / itinerary steps in the editor.
    flight_note: isExternal ? "" : flights.note,
    flights: isExternal
      ? []
      : flights.rows.map((row) => ({
          flight_date: row.flight_date ?? null,
          airline_flight: row.airline_flight ?? "",
          depart_time: row.depart_time ?? null,
          depart_city: row.depart_city ?? "",
          arrive_time: row.arrive_time ?? null,
          arrive_city: row.arrive_city ?? "",
          day_offset: row.day_offset ?? 0,
          leg_label: row.leg_label ?? null,
        })),
    feature_cards: isExternal
      ? []
      : content.featureCards.map((card) => ({
          title: card.title,
          body_html: card.body_html,
          images: toImages(card.images),
        })),
    days: isExternal
      ? []
      : days.map((day, index) => ({
          day_number: day.day_number,
          date: form.base_departure_date ? addDays(form.base_departure_date, index) : null,
          points: day.points ?? [],
          meals: { breakfast: day.breakfast ?? "", lunch: day.lunch ?? "", dinner: day.dinner ?? "" },
          lodging: day.lodging ?? "",
          description: day.description ?? "",
          images: toImages(content.days[index].images),
        })),
    // The public API only returns visible tabs.
    notice_tabs: content.noticeTabs
      .filter((tab) => tab.visible)
      .map(({ title, body_html }) => ({ title, body_html })),
  };
}
