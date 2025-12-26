// Settings and preferences types
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'ms' | 'kmh' | 'mph';
export type TimeFormat = '12h' | '24h';

export interface UserPreferences {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  timeFormat: TimeFormat;
  notificationsEnabled: boolean;
  weatherAlertsEnabled: boolean;
  favoriteActivities: string[];
  activityHistory: ActivityHistoryEntry[];
}

export interface ActivityHistoryEntry {
  activityId: string;
  date: string; // ISO date string
  weatherCondition: string;
  temperature: number;
  rating?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export interface WeatherAlert {
  id: string;
  type: 'severe' | 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor';
}

export interface AirQualityData {
  aqi: number; // 1-5 scale
  aqiLabel: string;
  pm2_5: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

export interface UVIndexData {
  value: number;
  level: 'low' | 'moderate' | 'high' | 'very-high' | 'extreme';
  recommendation: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'ms',
  timeFormat: '24h',
  notificationsEnabled: false,
  weatherAlertsEnabled: true,
  favoriteActivities: [],
  activityHistory: [],
};
