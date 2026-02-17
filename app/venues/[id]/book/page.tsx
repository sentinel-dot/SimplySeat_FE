import { notFound } from "next/navigation";
import { getVenueById } from "@/lib/api/venues";
import { SiteLayout } from "@/components/layout/site-layout";
import { VenueBookingFlow } from "@/components/venue-booking-flow";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const res = await getVenueById(Number(id));
  if (!res.success || !res.data) return { title: "Termin buchen – SimplySeat" };
  return {
    title: `Termin buchen – ${res.data.name} – SimplySeat`,
    description: `Termin bei ${res.data.name} buchen.`,
  };
}

export default async function VenueBookPage({ params, searchParams }: Props) {
  const { id } = await params;
  const search = (await searchParams) ?? {};
  const serviceId = typeof search.service === "string" ? search.service : undefined;
  const initialDate = typeof search.date === "string" ? search.date : undefined;
  const initialTime = typeof search.time === "string" ? search.time : undefined;
  const initialPartySize =
    typeof search.party_size === "string" && /^\d+$/.test(search.party_size)
      ? Math.min(8, Math.max(1, Number(search.party_size)))
      : undefined;
  const venueId = Number(id);
  if (Number.isNaN(venueId)) notFound();

  const res = await getVenueById(venueId);
  if (!res.success || !res.data) notFound();
  const venue = res.data;

  if (venue.is_active === false) notFound();

  return (
    <SiteLayout>
      <VenueBookingFlow
        venue={venue}
        preselectedServiceId={serviceId}
        initialDate={initialDate}
        initialTime={initialTime}
        initialPartySize={initialPartySize}
      />
    </SiteLayout>
  );
}
