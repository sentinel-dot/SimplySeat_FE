"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, MapPin, Clock, Phone, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/customer/FavoriteButton";
import { ReviewsList } from "@/components/customer/ReviewsList";
import { getVenueTypeLabel } from "@/lib/utils/venueType";
import type { VenueWithStaff, Service } from "@/lib/types";

const DAY_NAMES = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

interface VenueDetailProps {
  venue: VenueWithStaff;
  averageRating?: { average: number; count: number } | null;
}

export function VenueDetail({ venue, averageRating }: VenueDetailProps) {
  const [activeTab, setActiveTab] = useState<"services" | "reviews" | "about" | "hours">("services");
  const services = (venue.services ?? []).filter((s) => s.is_active !== false);
  const addressLine = [venue.address, venue.postal_code, venue.city].filter(Boolean).join(", ");
  const minPrice = services.length
    ? Math.min(...services.map((s) => s.price ?? 0).filter((p) => p > 0), Infinity)
    : null;
  const hasRealRating = averageRating && averageRating.count > 0;

  return (
    <div className="bg-background overflow-x-hidden">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden bg-muted sm:h-80 lg:h-96">
        {venue.image_url ? (
          <img src={venue.image_url} alt={venue.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-foreground/30" />
        {/* Obere Zeile: Zurück (content-aligned) + Favoriten (rechts) */}
        <div className="absolute left-0 right-0 top-4 z-10 flex items-center justify-between px-4 sm:top-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl flex items-center justify-between">
            <Link
              href="/venues"
              className="inline-flex items-center gap-1 rounded-full bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-card"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Zurück zur Suche
            </Link>
            <FavoriteButton
              venueId={venue.id}
              className="size-10 shrink-0 border-white/40 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white focus-visible:ring-white/50"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Badge className="mb-2 bg-primary text-primary-foreground">
                  {getVenueTypeLabel(venue.type)}
                </Badge>
                <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {venue.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  {hasRealRating ? (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-white">
                        {averageRating!.average.toFixed(1)}
                      </span>
                      <span className="text-sm text-white/70">
                        ({averageRating!.count} Bewertungen)
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-white/70">(Noch keine Bewertungen)</span>
                  )}
                  {(venue.city || addressLine) && (
                    <div className="flex items-center gap-1 text-white/80">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{venue.city || addressLine}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            {/* Tabs: horizontal scroll on mobile so labels don't overlap; wrap on larger screens */}
            <div className="min-w-0 w-full -mx-1 overflow-x-auto px-1 scrollbar-none sm:overflow-visible sm:mx-0 sm:px-0">
              <div className="flex w-max min-w-max gap-1 rounded-xl bg-muted p-1 sm:min-w-0 sm:w-full sm:flex-wrap">
                {(["services", "reviews", "hours", "about"] as const).map((tab) => {
                  const tabLabels: Record<string, string> = {
                    services: "Dienstleistungen",
                    reviews: "Bewertungen",
                    hours: "Öffnungszeiten",
                    about: "Über uns",
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors sm:flex-1 sm:min-w-0 sm:px-4 ${
                        activeTab === tab
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tabLabels[tab]}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeTab === "services" && (
              <div className="mt-6 flex flex-col gap-3">
                {services.length === 0 ? (
                  <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                    Derzeit sind keine buchbaren Leistungen hinterlegt.
                  </p>
                ) : (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                        {service.description && (
                          <p className="mt-0.5 text-sm text-muted-foreground">{service.description}</p>
                        )}
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          <Clock className="mr-1 inline h-3.5 w-3.5" />
                          {service.duration_minutes} Min.
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2">
                        {service.price != null && Number(service.price) > 0 && (
                          <p className="text-lg font-bold text-foreground">
                            {Number(service.price).toFixed(2)}
                            <span className="text-sm font-normal text-muted-foreground"> EUR</span>
                          </p>
                        )}
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                          <Link href={`/venues/${venue.id}/book?service=${service.id}`}>
                            Buchen
                            <ChevronRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="mt-6">
                <ReviewsList venueId={venue.id} />
              </div>
            )}

            {activeTab === "hours" && (
              <div className="mt-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    Öffnungszeiten
                  </h3>
                  {venue.opening_hours && venue.opening_hours.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                        const isToday = new Date().getDay() === dayOfWeek;
                        const slots = (venue.opening_hours ?? []).filter((s) => s.day_of_week === dayOfWeek);
                        const times = slots
                          .map((s) => `${s.start_time.slice(0, 5)} – ${s.end_time.slice(0, 5)}`)
                          .join(", ");
                        return (
                          <li
                            key={dayOfWeek}
                            className={`flex items-center justify-between gap-4 rounded-lg border-b border-border py-3 px-3 last:border-0 ${
                              isToday ? "border-l-4 border-l-primary bg-primary/10" : ""
                            }`}
                          >
                            <span className="flex items-center gap-2 font-medium text-foreground">
                              {DAY_NAMES[dayOfWeek]}
                              {isToday && (
                                <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                                  Heute
                                </span>
                              )}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {times || "Geschlossen"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Keine Öffnungszeiten hinterlegt.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="mt-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground">Über {venue.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {venue.description || "Keine Beschreibung hinterlegt."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">Kurzinfo</h3>
                <div className="mt-4 flex flex-col gap-3">
                  {(venue.address || venue.city) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{venue.city || "Adresse"}</p>
                        <p className="text-xs text-muted-foreground">{addressLine}</p>
                      </div>
                    </div>
                  )}
                  {venue.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Telefon</p>
                        <p className="text-xs text-muted-foreground">{venue.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                {minPrice != null && minPrice !== Infinity && minPrice > 0 ? (
                  <>
                    <p className="text-sm font-semibold text-foreground">Ab</p>
                    <p className="mt-1 text-3xl font-bold text-primary">
                      {minPrice.toFixed(2)}
                      <span className="text-base font-normal text-muted-foreground"> EUR</span>
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-foreground">Termin buchen</p>
                )}
                <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href={`/venues/${venue.id}/book`}>Termin buchen</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
