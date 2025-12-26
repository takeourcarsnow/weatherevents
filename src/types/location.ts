// Location-related types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  coordinates: Coordinates;
  city?: string;
  country?: string;
  displayName: string;
  isLoading: boolean;
  error?: string;
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type LocationPermissionStatus = 
  | 'prompt'
  | 'granted'
  | 'denied'
  | 'unavailable';
