'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Coordinates, WeatherData, ForecastData, WeatherApiResponse, ForecastApiResponse } from '@/types';
import { AirQualityData } from '@/types/settings';
import { parseWeatherData } from '@/utils';
import { useSettings } from '@/contexts/SettingsContext';

// Fetch weather from our API route
async function fetchWeather(coords: Coordinates, units: string): Promise<WeatherApiResponse> {
  const response = await fetch(
    `/api/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=${units}`
  );
  if (!response.ok) throw new Error('Failed to fetch weather');
  return response.json();
}

// Fetch forecast from our API route
async function fetchForecast(coords: Coordinates, units: string): Promise<ForecastApiResponse> {
  const response = await fetch(
    `/api/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=${units}`
  );
  if (!response.ok) throw new Error('Failed to fetch forecast');
  return response.json();
}

// Fetch air quality from our API route
async function fetchAirQuality(coords: Coordinates): Promise<AirQualityData> {
  const response = await fetch(
    `/api/air-quality?lat=${coords.latitude}&lon=${coords.longitude}`
  );
  if (!response.ok) throw new Error('Failed to fetch air quality');
  const data = await response.json();

  const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
  const aqi = data.list?.[0]?.main?.aqi || 1;
  const components = data.list?.[0]?.components || {};

  return {
    aqi,
    aqiLabel: aqiLabels[aqi - 1] || 'Unknown',
    pm2_5: components.pm2_5 || 0,
    pm10: components.pm10 || 0,
    o3: components.o3 || 0,
    no2: components.no2 || 0,
    so2: components.so2 || 0,
    co: components.co || 0,
  };
}

// Parse forecast response to our format
function parseForecastData(data: ForecastApiResponse): ForecastData {
  const hourly = data.list.slice(0, 8).map((item) => ({
    time: item.dt,
    temperature: Math.round(item.main.temp),
    conditions: item.weather.map((w) => ({
      id: w.id,
      main: w.main,
      description: w.description,
      icon: w.icon,
    })),
    pop: item.pop,
  }));

  const dailyMap = new Map<string, typeof data.list>();
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });

  const daily = Array.from(dailyMap.entries())
    .slice(0, 7)
    .map(([_, items]) => {
      const temps = items.map((i) => i.main.temp);
      const middleItem = items[Math.floor(items.length / 2)];

      return {
        date: items[0].dt,
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        conditions: middleItem.weather.map((w) => ({
          id: w.id,
          main: w.main,
          description: w.description,
          icon: w.icon,
        })),
        pop: Math.max(...items.map((i) => i.pop)),
        humidity: middleItem.main.humidity,
        windSpeed: middleItem.wind.speed,
      };
    });

  return { hourly, daily };
}

export function useWeatherQuery(coords: Coordinates | null) {
  const { preferences } = useSettings();
  const units = preferences.temperatureUnit === 'fahrenheit' ? 'imperial' : 'metric';

  return useQuery({
    queryKey: ['weather', coords?.latitude, coords?.longitude, units],
    queryFn: async () => {
      if (!coords) throw new Error('No coordinates');
      const data = await fetchWeather(coords, units);
      return parseWeatherData(data);
    },
    enabled: !!coords,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

export function useForecastQuery(coords: Coordinates | null) {
  const { preferences } = useSettings();
  const units = preferences.temperatureUnit === 'fahrenheit' ? 'imperial' : 'metric';

  return useQuery({
    queryKey: ['forecast', coords?.latitude, coords?.longitude, units],
    queryFn: async () => {
      if (!coords) throw new Error('No coordinates');
      const data = await fetchForecast(coords, units);
      return parseForecastData(data);
    },
    enabled: !!coords,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });
}

export function useAirQualityQuery(coords: Coordinates | null) {
  return useQuery({
    queryKey: ['airQuality', coords?.latitude, coords?.longitude],
    queryFn: async () => {
      if (!coords) throw new Error('No coordinates');
      return fetchAirQuality(coords);
    },
    enabled: !!coords,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useRefreshWeather() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['weather'] });
    queryClient.invalidateQueries({ queryKey: ['forecast'] });
    queryClient.invalidateQueries({ queryKey: ['airQuality'] });
  };
}
