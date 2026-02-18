"use client";

import { VenueCard } from "@/components/venue-card";
import type { Venue } from "@/lib/types";

type FeaturedProvidersProps = {
  venues: Venue[];
};

function dummyPrice(seed: number) {
  const prices = [35, 45, 55, 65];
  return `Ab ${prices[seed % prices.length]} €`;
}

function dummyNextSlot(index: number) {
  return index % 2 === 0 ? "Heute, 14:00" : "Morgen, 10:00";
}

export function FeaturedProviders({ venues }: FeaturedProvidersProps) {
  const showDummy = venues.length === 0;
  const displayList = showDummy ? getDummyVenues() : venues.slice(0, 8);

  return (
    <section id="featured" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showDummy && (
          <p className="mb-4 text-center">
            <span className="inline-flex items-center rounded-md border border-amber-500/50 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
              Platzhalter – echte Orte folgen
            </span>
          </p>
        )}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Handverlesen
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
            Top bewertet in deiner Nähe
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Die besten bewerteten Anbieter in deiner Nähe – von tausenden zufriedenen Kunden.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayList.map((venue, index) => (
            <div key={showDummy ? `dummy-${index}` : venue.id} className="relative">
              <VenueCard
                venue={venue}
                rating={index % 3 === 0 ? 4.9 : index % 3 === 1 ? 4.8 : 4.7}
                reviews={150 + index * 42}
                price={dummyPrice(showDummy ? index : venue.id)}
                nextSlot={dummyNextSlot(index)}
                popular={index < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getDummyVenues(): Venue[] {
  const types: Venue["type"][] = ["restaurant", "hair_salon", "beauty_salon", "spa"];
  const names = ["Beispiel Restaurant", "Beispiel Friseur", "Beispiel Kosmetik", "Beispiel Spa"];
  return names.map((name, i) => ({
    id: i + 1,
    name,
    type: types[i],
    email: "",
    city: "Berlin",
    address: undefined,
    postal_code: undefined,
    country: "DE",
    booking_advance_days: 30,
    booking_advance_hours: 48,
    cancellation_hours: 24,
    require_phone: false,
    require_deposit: false,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  })) as Venue[];
}
