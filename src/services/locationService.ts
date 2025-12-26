// Location service
import { Coordinates, GeocodingResult, LocationPermissionStatus } from '@/types';
import { API_CONFIG, DEFAULT_LOCATION } from '@/constants';

const GEO_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';

export async function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out'));
            break;
          default:
            reject(new Error('Unknown location error'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

export async function checkLocationPermission(): Promise<LocationPermissionStatus> {
  if (!navigator.permissions) {
    return 'unavailable';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state as LocationPermissionStatus;
  } catch {
    return 'unavailable';
  }
}

export async function geocodeCity(cityName: string): Promise<GeocodingResult[]> {
  const url = new URL(`${API_CONFIG.geoApiBaseUrl}/direct`);
  url.searchParams.append('q', cityName);
  url.searchParams.append('limit', '5');
  url.searchParams.append('appid', GEO_API_KEY);

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  return response.json();
}

export async function reverseGeocode(coords: Coordinates): Promise<GeocodingResult[]> {
  const url = new URL(`${API_CONFIG.geoApiBaseUrl}/reverse`);
  url.searchParams.append('lat', coords.latitude.toString());
  url.searchParams.append('lon', coords.longitude.toString());
  url.searchParams.append('limit', '1');
  url.searchParams.append('appid', GEO_API_KEY);

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Reverse geocoding API error: ${response.status}`);
  }

  return response.json();
}

export function getDefaultLocation(): Coordinates {
  return {
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
  };
}

export function formatLocationName(city?: string, country?: string): string {
  if (city && country) {
    return `${city}, ${country}`;
  }
  if (city) {
    return city;
  }
  return 'Unknown Location';
}

export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
