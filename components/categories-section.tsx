import Link from "next/link";
import { UtensilsCrossed, Scissors, Sparkles, Heart, HelpCircle } from "lucide-react";
import { VENUE_TYPES_ORDER, getVenueTypeLabel } from "@/lib/utils/venueType";
import type { Venue } from "@/lib/types";

const typeIcons: Record<Venue["type"], React.ComponentType<{ className?: string }>> = {
  restaurant: UtensilsCrossed,
  hair_salon: Scissors,
  beauty_salon: Sparkles,
  massage: Heart,
  other: HelpCircle,
};

export function CategoriesSection() {
  return (
    <section id="categories" className="bg-background py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-balance text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Nach Kategorie entdecken
          </h2>
          <p className="mt-2 sm:mt-3 text-pretty text-sm sm:text-base text-muted-foreground">
            Finde genau das, was du brauchst – aus unserem Angebot
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {VENUE_TYPES_ORDER.map((type, index) => {
            const Icon = typeIcons[type];
            return (
              <Link
                key={type}
                href={`/venues?type=${type}`}
                className="group flex min-h-[120px] sm:min-h-0 flex-col items-center justify-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-border bg-secondary/60 py-6 sm:py-8 px-3 sm:px-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5 active:scale-[0.98] animate-in fade-in slide-in-from-bottom-2 animate-fill-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {Icon && <Icon className="h-7 w-7" />}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{getVenueTypeLabel(type)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
