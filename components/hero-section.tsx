"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const popularSearches = ["Haarschnitt", "Massage", "Gesichtsbehandlung", "Maniküre", "Yoga"];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [when, setWhen] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (location.trim()) params.set("location", location.trim());
    if (when.trim()) params.set("date", when.trim());
    router.push(`/venues?${params.toString()}`);
  }

  const heroImageUrl = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80";

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImageUrl}
          alt="Kalender und Planer – buche deinen nächsten Termin"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/15 via-primary/20 to-primary/55"
          aria-hidden
        />
        <div
          className="pattern-dots absolute inset-0 text-primary-foreground/10"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="font-display mb-3 sm:mb-4 animate-in fade-in slide-in-from-bottom-3 animate-fill-both text-xs sm:text-sm font-medium uppercase tracking-widest text-primary-foreground/90 duration-500"
            style={{ animationDelay: "0ms" }}
          >
            Buche alles, jederzeit
          </p>
          <h1
            className="font-display text-balance text-3xl font-bold tracking-tight text-primary-foreground animate-in fade-in slide-in-from-bottom-4 animate-fill-both sm:text-5xl lg:text-6xl duration-700"
            style={{ animationDelay: "100ms" }}
          >
            Dein nächster Termin ist nur einen Klick entfernt
          </h1>
          <p
            className="mt-4 sm:mt-6 animate-in fade-in slide-in-from-bottom-4 animate-fill-both text-pretty text-base sm:text-lg leading-relaxed text-primary-foreground/85 duration-700"
            style={{ animationDelay: "200ms" }}
          >
            Entdecke und buche die besten lokalen Dienstleister. Von Friseur über Massage,
            Kosmetik bis Fitness — finde und reserviere in Sekunden.
          </p>
        </div>

        <div
          className="mx-auto mt-8 sm:mt-10 max-w-3xl animate-in fade-in slide-in-from-bottom-6 animate-fill-both duration-700"
          style={{ animationDelay: "300ms" }}
        >
          <div className="rounded-xl sm:rounded-2xl border border-white/15 bg-card/95 p-3 shadow-[var(--shadow-hero)] backdrop-blur-md">
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-2 md:flex-row md:items-center"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Wonach suchst du?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-h-[48px] w-full rounded-xl sm:rounded-2xl bg-secondary pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ort"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="min-h-[48px] w-full rounded-xl sm:rounded-2xl bg-secondary pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="relative md:w-44">
                <CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Wann?"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className="min-h-[48px] w-full rounded-xl sm:rounded-2xl bg-secondary pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="min-h-[48px] w-full rounded-xl sm:rounded-2xl bg-primary px-8 text-primary-foreground shadow-lg hover:bg-primary/90 md:w-auto"
              >
                <Search className="mr-2 h-4 w-4" />
                Suchen
              </Button>
            </form>
          </div>

          <div
            className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 animate-in fade-in animate-fill-both duration-500"
            style={{ animationDelay: "500ms" }}
          >
            <span className="text-xs text-primary-foreground/60">Beliebt:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchQuery(term);
                  router.push(`/venues?q=${encodeURIComponent(term)}`);
                }}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-xs font-medium text-primary-foreground/80 backdrop-blur-sm transition-colors hover:bg-primary-foreground/20 active:bg-primary-foreground/25"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
