"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getVenues } from "@/lib/api/venues";
import type { Venue } from "@/lib/types";
import {
  VENUE_TYPES_ORDER,
  getVenueTypeLabel,
} from "@/lib/utils/venueType";
import { ErrorMessage } from "@/components/shared/error-message";

const VALID_VENUE_TYPES: Venue["type"][] = ["restaurant", "hair_salon", "beauty_salon", "cafe", "bar", "spa"];

function typeFromParam(param: string | null): Venue["type"] | "all" {
  if (!param) return "all";
  return VALID_VENUE_TYPES.includes(param as Venue["type"]) ? (param as Venue["type"]) : "all";
}

export function VenuesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [panelLocation, setPanelLocation] = useState("");
  const [panelFilter, setPanelFilter] = useState<Venue["type"] | "all">("all");
  const [panelSort, setPanelSort] = useState<"name" | "distance">("name");

  const filter = useMemo(() => typeFromParam(searchParams.get("type")), [searchParams]);
  const locationParam = searchParams.get("location")?.trim() ?? "";
  const sortParam = searchParams.get("sort");
  const sort = sortParam === "distance" ? "distance" : "name";

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filter !== "all") n += 1;
    if (locationParam) n += 1;
    if (sort === "distance") n += 1;
    return n;
  }, [filter, locationParam, sort]);

  const applyParams = useCallback(
    (updates: { type?: Venue["type"] | "all"; location?: string; sort?: "name" | "distance" }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.type !== undefined) {
        if (updates.type === "all") params.delete("type");
        else params.set("type", updates.type);
      }
      if (updates.location !== undefined) {
        if (updates.location.trim()) {
          params.set("location", updates.location.trim());
          if (updates.sort === undefined && !params.get("sort")) params.set("sort", "distance");
        } else params.delete("location");
      }
      if (updates.sort !== undefined) {
        if (updates.sort === "name") params.delete("sort");
        else params.set("sort", "distance");
      }
      const q = params.toString();
      router.push(q ? `/venues?${q}` : "/venues", { scroll: false });
    },
    [searchParams, router]
  );

  const openFilterPanel = () => {
    setPanelLocation(locationParam);
    setPanelFilter(filter);
    setPanelSort(sort);
    setFilterOpen(true);
  };

  const closeFilterPanel = () => setFilterOpen(false);

  /** Wendet die aktuellen Panel-Werte an → URL-Update → ein useEffect lädt dann die Venues. */
  const applyFilterPanel = () => {
    const trimmed = panelLocation.trim();
    const effectiveSort = trimmed && panelSort === "distance" ? "distance" : "name";
    applyParams({
      type: panelFilter,
      location: trimmed,
      sort: effectiveSort,
    });
    closeFilterPanel();
  };

  const resetFilters = () => {
    setPanelFilter("all");
    setPanelSort("name");
    setPanelLocation("");
  };

  const queryString = [
    searchParams.get("location")?.trim() && `location=${encodeURIComponent(searchParams.get("location")!.trim())}`,
    searchParams.get("date") && `date=${encodeURIComponent(searchParams.get("date")!)}`,
    searchParams.get("time") && `time=${encodeURIComponent(searchParams.get("time")!)}`,
    searchParams.get("party_size") && `party_size=${encodeURIComponent(searchParams.get("party_size")!)}`,
    searchParams.get("type") && `type=${encodeURIComponent(searchParams.get("type")!)}`,
    searchParams.get("sort") && `sort=${encodeURIComponent(searchParams.get("sort")!)}`,
  ]
    .filter(Boolean)
    .join("&");
  const venueQuery = queryString ? `?${queryString}` : "";

  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const partySizeParam = searchParams.get("party_size");
  const partySizeNum =
    partySizeParam != null && partySizeParam !== "" && /^\d+$/.test(partySizeParam)
      ? Math.min(8, Math.max(1, parseInt(partySizeParam, 10)))
      : undefined;

  const hasDateOrTimeFilter = !!(dateParam || timeParam);
  const showSearchAssistance = venues.length === 0 && hasDateOrTimeFilter;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const params: import("@/lib/api/venues").VenuesParams = {};
        if (filter !== "all") params.type = filter;
        if (locationParam) params.location = locationParam;
        if (sort) params.sort = sort;
        if (dateParam) params.date = dateParam;
        if (timeParam) params.time = timeParam;
        if (partySizeNum != null) params.party_size = partySizeNum;
        const res = await getVenues(Object.keys(params).length > 0 ? params : undefined);
        if (!cancelled && res.success && res.data) {
          setVenues(Array.isArray(res.data) ? res.data : []);
        } else if (!res.success && res.message) {
          setError(res.message);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter, locationParam, sort, dateParam, timeParam, partySizeNum]);

  if (loading) {
    return (
      <div className="mt-10 flex justify-center py-14">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10">
        <ErrorMessage
          message={error}
          onRetry={() => {
            setError(null);
            setLoading(true);
            window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Filter-Button + aktive Filter-Anzeige */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openFilterPanel}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/50 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-expanded={filterOpen}
          aria-haspopup="dialog"
        >
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter & Sortierung
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>
        {activeFilterCount > 0 && !filterOpen && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Aktiv:</span>
            {filter !== "all" && (
              <span className="rounded-md bg-secondary px-2 py-0.5 font-medium text-foreground">
                {getVenueTypeLabel(filter)}
              </span>
            )}
            {locationParam && (
              <span className="rounded-md bg-secondary px-2 py-0.5 font-medium text-foreground">
                {locationParam}
              </span>
            )}
            {sort === "distance" && (
              <span className="rounded-md bg-secondary px-2 py-0.5 font-medium text-foreground">
                Nach Entfernung
              </span>
            )}
          </div>
        )}
      </div>

      {/* Slide-over Filter-Panel */}
      {filterOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 transition-opacity"
            aria-hidden
            onClick={closeFilterPanel}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-panel-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-card shadow-xl sm:max-w-md"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 id="filter-panel-title" className="text-lg font-semibold text-foreground">
                Filter & Sortierung
              </h2>
              <button
                type="button"
                onClick={closeFilterPanel}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Schließen"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Kategorie</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setPanelFilter("all")}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                        panelFilter === "all"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-border"
                      }`}
                    >
                      Alle
                    </button>
                    {VENUE_TYPES_ORDER.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPanelFilter(type)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                          panelFilter === type
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:border-border"
                        }`}
                      >
                        {getVenueTypeLabel(type)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="panel-location" className="mb-2 block text-sm font-medium text-foreground">
                    Ort oder PLZ
                  </label>
                  <input
                    id="panel-location"
                    type="text"
                    placeholder="z. B. Berlin, 10115"
                    value={panelLocation}
                    onChange={(e) => setPanelLocation(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") applyFilterPanel();
                    }}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
                  />
                </div>
                <div>
                  <label htmlFor="panel-sort" className="mb-2 block text-sm font-medium text-foreground">
                    Sortierung
                  </label>
                  <select
                    id="panel-sort"
                    value={panelSort}
                    onChange={(e) => setPanelSort(e.target.value as "name" | "distance")}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
                  >
                    <option value="name">Name (A–Z)</option>
                    <option value="distance" disabled={!panelLocation.trim()}>
                      {panelLocation.trim()
                        ? "Entfernung (vom Ort)"
                        : "Entfernung (zuerst Ort eingeben)"}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-border px-4 py-3">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Zurücksetzen
              </button>
              <button
                type="button"
                onClick={applyFilterPanel}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Anwenden
              </button>
            </div>
          </div>
        </>
      )}

      {/* Such-Assistenz: Keine Treffer bei Datum/Uhrzeit */}
      {showSearchAssistance && (
        <div className="mb-6 rounded-lg border border-primary/30 bg-secondary px-4 py-4 text-center">
          <p className="font-medium text-foreground">
            Keine freien Slots an diesem Tag.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Wählen Sie ein anderes Datum oder eine andere Uhrzeit – oder schauen Sie ohne Datum, welche Orte es gibt.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-card px-4 text-sm font-medium text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Neue Suche auf der Startseite
            </Link>
            <Link
              href={(() => {
                const p = new URLSearchParams(searchParams.toString());
                p.delete("date");
                p.delete("time");
                const q = p.toString();
                return q ? `/venues?${q}` : "/venues";
              })()}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Alle Orte ohne Datum anzeigen
            </Link>
          </div>
        </div>
      )}

      {venues.length === 0 && !showSearchAssistance ? (
        <div className="rounded-lg border border-border bg-card py-16 text-center">
          <p className="text-muted-foreground">
            {filter === "all"
              ? "Noch keine Orte eingetragen."
              : `Keine Orte in der Kategorie „${getVenueTypeLabel(filter)}“.`}
          </p>
          {locationParam && (
            <p className="mt-2 text-sm text-muted-foreground">
              Keine Orte für „{locationParam}“ gefunden. Versuchen Sie einen anderen Ort oder PLZ.
            </p>
          )}
        </div>
      ) : venues.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <li key={venue.id} className="flex">
              <Link
                href={`/venues/${venue.id}${venueQuery}`}
                className="flex transition-shadow duration-200 hover:shadow-md h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-card"
              >
                {/* Venue-Bild oder Platzhalter */}
                {venue.image_url ? (
                  <div className="relative h-36 w-full shrink-0 overflow-hidden bg-background">
                    <img
                      src={venue.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="h-36 shrink-0 bg-background" aria-hidden />
                )}
                <div className="flex min-h-0 flex-1 flex-col p-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {getVenueTypeLabel(venue.type)}
                  </span>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    {venue.name}
                  </h2>
                  {venue.city && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {venue.city}
                      {venue.address && ` · ${venue.address}`}
                    </p>
                  )}
                  {/* Feste Höhe für Beschreibung, damit alle Karten gleich hoch sind */}
                  <p className="mt-2 min-h-[2.5rem] text-sm text-muted-foreground line-clamp-2">
                    {venue.description ?? "\u00A0"}
                  </p>
                  <span className="mt-4 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">
                    {venue.type === "restaurant" ? "Tisch reservieren" : "Termin buchen"}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
