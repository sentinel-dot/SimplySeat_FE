import { notFound } from "next/navigation";
import { getVenueById } from "@/lib/api/venues";
import { getVenueAverageRating } from "@/lib/api/reviews";
import { SiteLayout } from "@/components/layout/site-layout";
import { VenueDetail } from "@/components/venue-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const res = await getVenueById(Number(id));
  if (!res.success || !res.data) return { title: "Ort – SimplySeat" };
  return {
    title: `${res.data.name} – SimplySeat`,
    description: res.data.description ?? `Jetzt bei ${res.data.name} buchen.`,
  };
}

export default async function VenuePage({ params }: Props) {
  const { id } = await params;
  const venueId = Number(id);
  if (Number.isNaN(venueId)) notFound();

  const [venueRes, ratingRes] = await Promise.all([
    getVenueById(venueId),
    getVenueAverageRating(venueId).catch(() => ({ success: false as const, data: null })),
  ]);

  if (!venueRes.success || !venueRes.data) notFound();
  const venue = venueRes.data;

  if (venue.is_active === false) notFound();

  const averageRating = ratingRes.success && ratingRes.data ? ratingRes.data : null;

  return (
    <SiteLayout>
      <VenueDetail venue={venue} averageRating={averageRating} />
    </SiteLayout>
  );
}
