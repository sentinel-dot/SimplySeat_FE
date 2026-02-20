import { useState, useCallback } from "react";

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export interface UseGeolocationReturn {
  position: GeolocationPosition | null;
  loading: boolean;
  error: GeolocationError | null;
  requestLocation: () => Promise<GeolocationPosition | null>;
}

/**
 * Hook for accessing browser geolocation API
 * @returns Object with position, loading state, error, and requestLocation function
 */
export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);

  const requestLocation = useCallback(async (): Promise<GeolocationPosition | null> => {
    if (!navigator.geolocation) {
      const err: GeolocationError = {
        code: 0,
        message: "Geolocation wird von deinem Browser nicht unterstützt",
      };
      setError(err);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const pos = await new Promise<globalThis.GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000,
        });
      });

      const geoPosition: GeolocationPosition = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };

      setPosition(geoPosition);
      setLoading(false);
      return geoPosition;
    } catch (err: any) {
      const geoError: GeolocationError = {
        code: err.code || -1,
        message:
          err.code === 1
            ? "Standortzugriff verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen."
            : err.code === 2
            ? "Standort nicht verfügbar. Bitte versuche es erneut."
            : err.code === 3
            ? "Zeitüberschreitung bei der Standortabfrage."
            : "Standort konnte nicht ermittelt werden.",
      };

      setError(geoError);
      setLoading(false);
      return null;
    }
  }, []);

  return { position, loading, error, requestLocation };
}
