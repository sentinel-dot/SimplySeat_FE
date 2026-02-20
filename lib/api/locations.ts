import { apiClient } from "./client";

/**
 * Get location autocomplete suggestions
 * @param query Search query (min. 2 characters)
 * @returns Array of location strings (cities and postal codes)
 */
export async function getLocationSuggestions(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { success: true, data: [] as string[] };
  }
  
  const params = new URLSearchParams({ q: trimmed });
  return apiClient<string[]>(`/venues/locations/autocomplete?${params.toString()}`);
}
