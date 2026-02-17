import { SiteLayout } from "@/components/layout/site-layout";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { StatsSection } from "@/components/stats-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FeaturedProviders } from "@/components/featured-providers";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CtaSection } from "@/components/cta-section";
import { getPublicStats } from "@/lib/api/venues";

export default async function HomePage() {
  let stats: { venueCount: number; bookingCountThisMonth: number } | null = null;
  try {
    const res = await getPublicStats();
    if (res.success && res.data) stats = res.data;
  } catch {
    // Stats optional – Seite bleibt nutzbar
  }

  return (
    <SiteLayout>
      <div className="min-h-screen overflow-x-hidden">
        <HeroSection />
        <CategoriesSection />
        <StatsSection
          venueCount={stats?.venueCount}
          bookingCountThisMonth={stats?.bookingCountThisMonth}
        />
        <HowItWorksSection />
        <FeaturedProviders />
        <TestimonialsSection />
        <CtaSection />
      </div>
    </SiteLayout>
  );
}
