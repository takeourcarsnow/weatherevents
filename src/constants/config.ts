// Application constants and configuration
export const APP_CONFIG = {
  name: 'WeatherPlanner',
  description: 'Plan your day based on weather',
  version: '2.0.0',
};

export const API_CONFIG = {
  weatherApiBaseUrl: 'https://api.openweathermap.org/data/2.5',
  geoApiBaseUrl: 'https://api.openweathermap.org/geo/1.0',
  defaultUnits: 'metric' as const,
  defaultLang: 'en',
};

export const DEFAULT_LOCATION = {
  latitude: 40.7128,
  longitude: -74.006,
  city: 'New York',
  country: 'US',
};

export const STORAGE_KEYS = {
  theme: 'weather-planner-theme',
  location: 'weather-planner-location',
  preferences: 'weather-planner-preferences',
  settings: 'weather-planner-settings',
  savedLocations: 'weather-planner-saved-locations',
  weatherCache: 'weather-planner-weather-cache',
};

export const REFRESH_INTERVALS = {
  weather: 10 * 60 * 1000, // 10 minutes
  events: 30 * 60 * 1000, // 30 minutes
  location: 60 * 60 * 1000, // 1 hour
  airQuality: 30 * 60 * 1000, // 30 minutes
};

export const UI_CONFIG = {
  animationDuration: 300,
  toastDuration: 4000,
  maxActivitySuggestions: 6,
  maxEventsDisplay: 10,
  pullToRefreshThreshold: 80,
};
