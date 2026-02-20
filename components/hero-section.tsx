"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValidatedInput, ValidationState } from "@/components/ui/validated-input";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { VENUE_TYPES_ORDER, getVenueTypeLabel } from "@/lib/utils/venueType";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { getLocationSuggestions } from "@/lib/api/locations";

function getTimePlaceholder(): string {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 11) {
    return "z.B. Café, Frühstück";
  } else if (hour >= 11 && hour < 14) {
    return "z.B. Restaurant, Mittagstisch";
  } else if (hour >= 17 && hour < 22) {
    return "z.B. Restaurant, Bar";
  } else {
    return "z.B. Friseur, Massage";
  }
}

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [queryValidation, setQueryValidation] = useState<ValidationState>("idle");
  const [locationValidation, setLocationValidation] = useState<ValidationState>("idle");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const debouncedLocation = useDebounce(location, 300);
  const { loading: isGeolocating, error: geoError, requestLocation } = useGeolocation();
  
  const queryPlaceholder = useMemo(() => `Wonach suchst du? ${getTimePlaceholder()}`, []);

  useEffect(() => {
    if (!searchQuery) {
      setQueryValidation("idle");
    } else if (searchQuery.length < 2) {
      setQueryValidation("error");
    } else if (!/^[a-zA-ZäöüÄÖÜß\s-]+$/.test(searchQuery)) {
      setQueryValidation("error");
    } else {
      setQueryValidation("valid");
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedLocation) {
      setLocationValidation("idle");
      setLocationSuggestions([]);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const result = await getLocationSuggestions(debouncedLocation);
        if (cancelled) return;

        if (result.success && result.data) {
          const suggestions = result.data;
          setLocationSuggestions(suggestions);

          const exactMatch = suggestions.some(
            (s) => s.toLowerCase() === debouncedLocation.toLowerCase()
          );

          if (exactMatch) {
            setLocationValidation("valid");
          } else if (suggestions.length > 0) {
            setLocationValidation("warning");
          } else {
            setLocationValidation("error");
          }
        }
      } catch (error) {
        if (!cancelled) {
          setLocationSuggestions([]);
          setLocationValidation("idle");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedLocation]);

  useEffect(() => {
    if (geoError) {
      setToastMessage(geoError.message);
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [geoError]);

  async function handleGeolocation() {
    const position = await requestLocation();
    if (!position) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${position.latitude}&lon=${position.longitude}&format=json`,
        { headers: { "User-Agent": "SimplySeat/1.0" } }
      );
      
      if (!response.ok) {
        setToastMessage("Standort konnte nicht ermittelt werden");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }

      const data = await response.json();
      const city = data.address?.city || data.address?.town || data.address?.village;
      
      if (city) {
        setLocation(city);
        setLocationValidation("valid");
        setToastMessage(`Standort gefunden: ${city}`);
        setTimeout(() => setToastMessage(null), 2000);
      } else {
        setToastMessage("Stadtname konnte nicht ermittelt werden");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (error) {
      setToastMessage("Fehler beim Ermitteln des Standorts");
      setTimeout(() => setToastMessage(null), 3000);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    
    const trimmedQuery = searchQuery.trim();
    const trimmedLocation = location.trim();
    
    if (!trimmedQuery && !trimmedLocation) {
      return;
    }

    setIsSearching(true);
    
    const params = new URLSearchParams();
    if (trimmedQuery) params.set("q", trimmedQuery);
    if (trimmedLocation) params.set("location", trimmedLocation);
    
    router.push(`/venues?${params.toString()}`);
  }

  const canSearch = searchQuery.trim().length > 0 || location.trim().length > 0;
  const queryErrorMsg = 
    searchQuery.length > 0 && searchQuery.length < 2
      ? "Mindestens 2 Zeichen"
      : searchQuery.length > 0 && !/^[a-zA-ZäöüÄÖÜß\s-]+$/.test(searchQuery)
      ? "Nur Buchstaben, Leerzeichen und Bindestriche erlaubt"
      : undefined;

  const locationWarningMsg =
    locationValidation === "warning" && locationSuggestions.length > 0
      ? `Meintest du: ${locationSuggestions.slice(0, 3).join(", ")}?`
      : locationValidation === "error" && location.length >= 2
      ? "Ort nicht gefunden. Versuche eine nahegelegene Stadt."
      : undefined;

  const heroImageUrl = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80";

  return (
    <section id="hero" className="relative overflow-hidden">
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

      {toastMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-top-2 rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-lg"
        >
          {toastMessage}
        </div>
      )}

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
          className="mx-auto mt-10 max-w-2xl animate-in fade-in slide-in-from-bottom-6 animate-fill-both duration-700"
          style={{ animationDelay: "300ms" }}
        >
          <form onSubmit={handleSearch}>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <ValidatedInput
                    type="search"
                    placeholder={queryPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    validationState={queryValidation}
                    errorMessage={queryErrorMsg}
                    icon={<Search className="h-5 w-5 text-muted-foreground" />}
                    className="h-12 bg-transparent"
                  />
                </div>

                <div className="hidden h-12 w-px bg-border sm:block" />

                <div className="flex-1">
                  <AutocompleteInput
                    type="text"
                    placeholder="Dein Ort (Stadt oder PLZ)"
                    value={location}
                    onChange={setLocation}
                    suggestions={locationSuggestions}
                    validationState={locationValidation}
                    warningMessage={locationWarningMsg}
                    icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
                    rightElement={
                      <button
                        type="button"
                        onClick={handleGeolocation}
                        disabled={isGeolocating}
                        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                        aria-label="Aktuellen Standort verwenden"
                        title="Aktuellen Standort verwenden"
                      >
                        {isGeolocating ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Navigation className="h-5 w-5" />
                        )}
                      </button>
                    }
                    onSuggestionSelect={(suggestion) => {
                      setLocation(suggestion);
                      setLocationValidation("valid");
                    }}
                    className="h-12 bg-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!canSearch || isSearching}
                  className="h-12 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:min-w-[120px]"
                  aria-label={!canSearch ? "Gib mindestens einen Suchbegriff oder Ort ein" : "Suchen"}
                  title={!canSearch ? "Gib mindestens einen Suchbegriff oder Ort ein" : undefined}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suche...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Suchen
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div
            className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 animate-in fade-in animate-fill-both duration-500"
            style={{ animationDelay: "500ms" }}
          >
            <span className="text-xs text-primary-foreground/60">Beliebt:</span>
            {VENUE_TYPES_ORDER.filter((t) => t !== "other").map((type) => {
              const label = getVenueTypeLabel(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSearchQuery(label);
                    setQueryValidation("valid");
                  }}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-xs font-medium text-primary-foreground/80 backdrop-blur-sm transition-colors hover:bg-primary-foreground/20 active:bg-primary-foreground/25"
                  aria-label={`Nach ${label} suchen`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
