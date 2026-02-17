"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Clock, Heart } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getVenueTypeLabel } from "@/lib/utils/venueType";
import type { Venue } from "@/lib/types";

const FALLBACK_IMAGES: Record<Venue["type"], string> = {
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  hair_salon: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
  beauty_salon: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800",
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
  bar: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800",
  spa: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
};

type FeaturedCardProps = {
  venue: Venue;
  rating: number;
  reviews: number;
  price: string;
  nextSlot: string;
  popular: boolean;
};

function FeaturedCard({ venue, rating, reviews, price, nextSlot, popular }: FeaturedCardProps) {
  const [liked, setLiked] = useState(false);
  const imageUrl = venue.image_url || FALLBACK_IMAGES[venue.type];
  const location = [venue.city, venue.address].filter(Boolean).join(", ") || "Deutschland";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <Link href={`/venues/${venue.id}`} className="block h-full w-full">
          <Image
            src={imageUrl}
            alt={venue.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
        </Link>
        {popular && (
          <Badge className="absolute left-3 top-3 border-0 bg-primary text-primary-foreground text-xs font-semibold">
            Beliebt
          </Badge>
        )}
        <button
          type="button"
          onClick={() => setLiked(!liked)}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card"
          aria-label={liked ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        >
          <Heart
            className={`h-4 w-4 ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-semibold text-foreground">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        <Link href={`/venues/${venue.id}`}>
          <h3 className="mt-2 text-lg font-bold text-foreground hover:text-primary">
            {venue.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{getVenueTypeLabel(venue.type)}</p>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {location}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4 mt-4">
          <div>
            <p className="text-sm font-bold text-foreground">{price}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium">{nextSlot}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type FeaturedProvidersProps = {
  venues: Venue[];
};

function dummyPrice() {
  const prices = [35, 45, 55, 65];
  return `Ab ${prices[Math.floor(Math.random() * prices.length)]} €`;
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
              <FeaturedCard
                venue={venue}
                rating={index % 3 === 0 ? 4.9 : index % 3 === 1 ? 4.8 : 4.7}
                reviews={150 + index * 42}
                price={dummyPrice()}
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
