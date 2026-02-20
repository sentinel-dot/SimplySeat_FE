import { apiClient } from "./client";
import type { Venue, VenueWithStaff } from "../types";

export type FeaturedVenueItem = Venue & {
  averageRating: number | null;
  reviewCount: number;
  /** Vom Backend gesetzt: Top-2 der Featured-Liste gelten als „Beliebt“. */
  popular: boolean;
};

/** Venue-Liste inkl. Bewertung (GET /venues) */
export type VenueListItem = Venue & {
  averageRating: number | null;
  reviewCount: number;
};

export type VenuesParams = {
  type?: Venue["type"];
  date?: string;
  party_size?: number;
  time?: string;
  location?: string;
  sort?: "name" | "distance";
  /** Freitext-Suche nach Venue-Name/Beschreibung */
  q?: string;
};

export async function getVenues(params?: VenuesParams) {
  if (!params || Object.keys(params).length === 0) {
    return apiClient<VenueListItem[]>(`/venues`);
  }
  const search = new URLSearchParams();
  if (params.type) search.set("type", params.type);
  if (params.date) search.set("date", params.date);
  if (params.party_size != null && params.party_size >= 1) search.set("party_size", String(params.party_size));
  if (params.time) search.set("time", params.time);
  if (params.location?.trim()) search.set("location", params.location.trim());
  if (params.sort) search.set("sort", params.sort);
  if (params.q?.trim()) search.set("q", params.q.trim());
  const queryString = search.toString();
  return apiClient<VenueListItem[]>(`/venues${queryString ? `?${queryString}` : ""}`);
}

export type PublicStats = {
  venueCount: number;
  bookingCountThisMonth: number;
  averageRating: number | null;
  reviewCount: number;
};

export async function getPublicStats() {
  return apiClient<PublicStats>(`/venues/stats`, {
    next: { revalidate: 300 }
  });
}

export type FeaturedVenuesParams = {
  limit?: number;
  /** Ort/PLZ – wird geocodiert, nur Venues in 30 km */
  location?: string | null;
  /** Browser-Standort (lat/lng) – nur Venues in 30 km */
  lat?: number | null;
  lng?: number | null;
};

export async function getFeaturedVenues(limit = 8, location?: string | null, lat?: number | null, lng?: number | null) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (location?.trim()) params.set("location", location.trim());
  if (lat != null && !Number.isNaN(lat)) params.set("lat", String(lat));
  if (lng != null && !Number.isNaN(lng)) params.set("lng", String(lng));
  return apiClient<FeaturedVenueItem[]>(`/venues/featured?${params.toString()}`);
}

export async function getVenueById(id: number)
{
    return apiClient<VenueWithStaff>(`/venues/${id}`);
}