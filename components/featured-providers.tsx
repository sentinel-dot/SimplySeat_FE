import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getVenues } from "@/lib/api/venues";
import { getVenueTypeLabel } from "@/lib/utils/venueType";
import type { Venue } from "@/lib/types";

const FEATURED_LIMIT = 8;

export async function FeaturedProviders() {
  let list: Venue[] = [];
  try {
    const res = await getVenues();
    if (res.success && Array.isArray(res.data)) list = res.data.slice(0, FEATURED_LIMIT);
  } catch {
    // optional
  }

  const showDummy = list.length === 0;
  const displayList = showDummy
    ? ([
        { id: 0, name: "Beispiel Ort 1", type: "restaurant" as const, city: "Stadt" },
        { id: 0, name: "Beispiel Ort 2", type: "hair_salon" as const, city: "Stadt" },
        { id: 0, name: "Beispiel Ort 3", type: "beauty_salon" as const, city: "Stadt" },
        { id: 0, name: "Beispiel Ort 4", type: "massage" as const, city: "Stadt" },
      ] as Venue[])
    : list;

  return (
    <section id="providers" className="border-t border-border bg-muted/60 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showDummy && (
          <p className="mb-4 text-center">
            <span className="inline-flex items-center rounded-md border border-amber-500/50 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
              Platzhalter – echte Orte folgen
            </span>
          </p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-balance text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Top-Orte
            </h2>
            <p className="mt-2 sm:mt-3 text-pretty text-sm sm:text-base text-muted-foreground">
              Entdecke buchbare Betriebe in deiner Nähe
            </p>
          </div>
          <Link
            href="/venues"
            className="hidden text-sm font-medium text-primary hover:underline sm:block"
          >
            Alle Orte anzeigen
          </Link>
        </div>

        <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayList.map((venue, index) => (
            <Link
              key={showDummy ? `dummy-${index}` : venue.id}
              href={showDummy ? "/venues" : `/venues/${venue.id}`}
              className={cn(
                "group block overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/20 hover:-translate-y-1 active:scale-[0.99] animate-in fade-in slide-in-from-bottom-3 animate-fill-both",
                index < 2
                  ? "shadow-[var(--shadow-card-featured)] hover:shadow-[var(--shadow-card-hover)]"
                  : "shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {venue.image_url ? (
                  <img
                    src={venue.image_url}
                    alt={venue.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <MapPin className="h-12 w-12" />
                  </div>
                )}
                {showDummy ? (
                  <Badge className="absolute left-3 top-3 border-amber-500/50 bg-amber-500/20 text-amber-800 dark:text-amber-200 border shadow-md">
                    Platzhalter
                  </Badge>
                ) : index < 2 ? (
                  <Badge className="absolute left-3 top-3 bg-highlight text-highlight-foreground border-0 shadow-md">
                    Empfohlen
                  </Badge>
                ) : null}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {getVenueTypeLabel(venue.type)}
                </p>
                <h3 className="mt-1.5 font-semibold text-foreground group-hover:text-primary">
                  {venue.name}
                </h3>
                {(venue.city || (venue as Venue).address) && (
                  <div className="mt-1.5 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-xs truncate">
                      {[venue.city, (venue as Venue).address].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/venues" className="text-sm font-medium text-primary hover:underline">
            Alle Orte anzeigen
          </Link>
        </div>
      </div>
    </section>
  );
}
