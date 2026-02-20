import type { Venue } from "@/lib/types";

const VENUE_TYPE_LABELS: Record<Venue["type"], string> = {
  restaurant: "Restaurant",
  hair_salon: "Friseur",
  beauty_salon: "Kosmetik",
  cafe: "Café",
  bar: "Bar",
  spa: "Spa & Wellness",
  other: "Sonstiges",
};

export const VENUE_TYPES_ORDER: Venue["type"][] = [
  "restaurant",
  "hair_salon",
  "beauty_salon",
  "cafe",
  "bar",
  "spa",
  "other",
];

export function getVenueTypeLabel(type: Venue["type"]): string {
  return VENUE_TYPE_LABELS[type] ?? type;
}
