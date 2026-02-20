import { SiteLayout } from "@/components/layout/site-layout";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { StatsSection } from "@/components/stats-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FeaturedProviders } from "@/components/featured-providers";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CtaSection } from "@/components/cta-section";
import { getPublicStats, getFeaturedVenues } from "@/lib/api/venues";
import type { Venue } from "@/lib/types";
import type { PublicStats } from "@/lib/api/venues";

export default async function HomePage() {
  let stats: PublicStats | null = null;
  try {
    const res = await getPublicStats();
    if (res.success && res.data) stats = res.data;
  } catch {
    // Stats optional – Seite bleibt nutzbar
  }

  let featuredWithRatings: { venue: Venue; averageRating: number | null; reviewCount: number; popular: boolean }[] = [];
  try {
    const res = await getFeaturedVenues(8);
    if (res.success && Array.isArray(res.data)) {
      featuredWithRatings = res.data.map((v) => {
        const { averageRating, reviewCount, popular, ...venue } = v;
        return {
          venue,
          averageRating: averageRating ?? null,
          reviewCount: reviewCount ?? 0,
          popular: popular ?? false,
        };
      });
    }
  } catch {
    // optional – Featured zeigt dann leer oder Fallback
  }

  return (
    <SiteLayout>
      <div className="min-h-screen overflow-x-hidden">
        <HeroSection />
        <CategoriesSection />
        <StatsSection
          venueCount={stats?.venueCount}
          bookingCountThisMonth={stats?.bookingCountThisMonth}
          averageRating={stats?.averageRating ?? undefined}
          satisfiedCustomersCount={stats?.reviewCount ?? undefined}
        />
        <HowItWorksSection />
        <FeaturedProviders featuredVenues={featuredWithRatings} />
        <TestimonialsSection />
        <CtaSection />
      </div>
    </SiteLayout>
  );
}
