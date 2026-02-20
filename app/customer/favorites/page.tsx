"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites } from "@/lib/api/favorites";
import type { CustomerFavorite } from "@/lib/api/favorites";
import { VenueCard } from "@/components/venue-card";

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<CustomerFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites()
      .then((res) => {
        if (res.success && res.data) setFavorites(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const withVenue = favorites.filter((fav) => fav.venue);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
        Favoriten
      </h1>
      <p className="mt-1 text-muted-foreground">
        Ihre gespeicherten Orte.
      </p>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/50" />
          ))}
        </div>
      ) : withVenue.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Noch keine Favoriten gespeichert.</p>
          <Link
            href="/venues"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/90"
          >
            Orte entdecken
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {withVenue.map((fav) => (
            <div key={fav.id} className="h-full">
              <VenueCard
                venue={fav.venue}
                showFavoriteButton
                favorited
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
