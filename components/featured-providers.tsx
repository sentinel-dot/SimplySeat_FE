"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { VenueCard } from "@/components/venue-card";
import { getFeaturedVenues } from "@/lib/api/venues";
import type { Venue } from "@/lib/types";

const STORAGE_KEY = "featured_location";
const STORAGE_GEO_PREFIX = "geo:";

export type FeaturedVenue = {
  venue: Venue;
  averageRating: number | null;
  reviewCount: number;
  popular?: boolean;
};

type FeaturedProvidersProps = {
  featuredVenues: FeaturedVenue[];
};

function parseFeaturedResponse(data: Awaited<ReturnType<typeof getFeaturedVenues>>["data"]): FeaturedVenue[] {
  if (!Array.isArray(data)) return [];
  return data.map((v) => {
    const { averageRating, reviewCount, popular, ...venue } = v;
    return {
      venue,
      averageRating: averageRating ?? null,
      reviewCount: reviewCount ?? 0,
      popular: popular ?? false,
    };
  });
}

export function FeaturedProviders({ featuredVenues }: FeaturedProvidersProps) {
  const [location, setLocation] = useState<string | null>(null);
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [list, setList] = useState<FeaturedVenue[]>(featuredVenues);
  const [loading, setLoading] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);

  const fetchFeatured = useCallback(
    async (loc?: string | null, lat?: number | null, lng?: number | null) => {
      setLoading(true);
      setGeoError(null);
      try {
        const res = await getFeaturedVenues(8, loc ?? undefined, lat ?? undefined, lng ?? undefined);
        if (res.success && Array.isArray(res.data)) {
          setList(parseFeaturedResponse(res.data));
        }
      } catch {
        // keep current list
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored?.trim()) return;
    if (stored.startsWith(STORAGE_GEO_PREFIX)) {
      const part = stored.slice(STORAGE_GEO_PREFIX.length).trim();
      const [latStr, lngStr] = part.split(",");
      const lat = parseFloat(latStr ?? "");
      const lng = parseFloat(lngStr ?? "");
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        setGeoCoords({ lat, lng });
        fetchFeatured(undefined, lat, lng);
      }
    } else {
      setLocation(stored.trim());
      fetchFeatured(stored.trim());
    }
  }, [fetchFeatured]);

  const handleSetLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const value = locationInput.trim();
    if (!value) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, value);
    }
    setLocation(value);
    setGeoCoords(null);
    setShowLocationInput(false);
    setLocationInput("");
    fetchFeatured(value);
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Standort wird von deinem Browser nicht unterstützt.");
      return;
    }
    setLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (typeof window !== "undefined") {
          sessionStorage.setItem(STORAGE_KEY, `${STORAGE_GEO_PREFIX}${lat},${lng}`);
        }
        setLocation(null);
        setGeoCoords({ lat, lng });
        fetchFeatured(undefined, lat, lng);
      },
      () => {
        setLoading(false);
        setGeoError("Standort konnte nicht ermittelt werden. Bitte Ort manuell eingeben.");
      }
    );
  };

  const handleClearLocation = () => {
    if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
    setLocation(null);
    setGeoCoords(null);
    setList(featuredVenues);
  };

  const displayList = list.slice(0, 8);
  const hasLocation = !!location?.trim() || !!geoCoords;
  const locationLabel = location?.trim() || (geoCoords ? "Dein Standort" : null);

  return (
    <section id="featured" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Handverlesen
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
            {hasLocation ? "Top bewertet in deiner Nähe" : "Top bewertet"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {hasLocation
              ? "Die besten bewerteten Anbieter in deiner Nähe – von tausenden zufriedenen Kunden."
              : "Die besten bewerteten Anbieter – von tausenden zufriedenen Kunden."}
          </p>
          {geoError && (
            <p className="mt-2 text-sm text-destructive">{geoError}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {hasLocation ? (
              <span className="text-sm text-muted-foreground">
                Ort: <strong className="text-foreground">{locationLabel}</strong>
                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="ml-2 text-primary hover:underline"
                >
                  Ändern
                </button>
              </span>
            ) : (
              <>
                {!showLocationInput ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowLocationInput(true)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Ort angeben
                    </button>
                    <span className="text-muted-foreground">oder</span>
                    <button
                      type="button"
                      onClick={handleUseGeolocation}
                      disabled={loading}
                      className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                    >
                      Standort verwenden
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleSetLocation} className="flex flex-wrap items-center justify-center gap-2">
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="z. B. Berlin oder 10115"
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Übernehmen
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowLocationInput(false); setLocationInput(""); }}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Abbrechen
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : displayList.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dashed border-border bg-card/50 py-12 text-center">
            <p className="text-muted-foreground">
              Aktuell sind noch keine Orte gelistet. Sobald Anbieter dabei sind, erscheinen sie hier.
            </p>
            <Link
              href="/venues"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Alle Orte anzeigen →
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayList.map((item, index) => (
              <div key={item.venue.id} className="relative h-full">
                <VenueCard
                  venue={item.venue}
                  rating={item.averageRating ?? undefined}
                  reviews={item.reviewCount}
                  popular={item.popular ?? false}
                  showFavoriteButton={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
