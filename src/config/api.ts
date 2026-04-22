/**
 * API Configuration
 * Centralized API base URL configuration using environment variables
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Helper function to build full API endpoint URLs
 */
export function buildApiUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

/**
 * Helper function to build full API endpoint URLs with query parameters
 */
export function buildApiUrlWithParams(
  path: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const url = buildApiUrl(path);
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  ).toString();
  return queryString ? `${url}?${queryString}` : url;
}
