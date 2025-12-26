'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Coordinates, WeatherData, ForecastData, LocationData } from '@/types';
import {
  getCurrentPosition,
  reverseGeocode,
  getDefaultLocation,
  formatLocationName,
} from '@/services/locationService';
import {
  fetchWeatherByCoords,
  fetchForecast,
  getMockWeatherData,
  getMockForecastData,
} from '@/services/weatherService';
import { setStoredLocation, getStoredLocation } from '@/utils';
import { REFRESH_INTERVALS } from '@/constants';

interface AppState {
  location: LocationData;
  weather: WeatherData | null;
  forecast: ForecastData | null;
  isLoading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  refreshWeather: () => Promise<void>;
  refreshLocation: () => Promise<void>;
  setManualLocation: (coords: Coordinates, city?: string, country?: string) => void;
  useDemoMode: () => void;
}

const initialState: AppState = {
  location: {
    coordinates: getDefaultLocation(),
    displayName: 'Loading...',
    isLoading: true,
  },
  weather: null,
  forecast: null,
  isLoading: true,
  error: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const fetchLocationAndWeather = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Try to get stored location first
      const storedLocation = getStoredLocation();
      let coords: Coordinates;
      let city: string | undefined;
      let country: string | undefined;

      if (storedLocation) {
        coords = { latitude: storedLocation.latitude, longitude: storedLocation.longitude };
        city = storedLocation.city;
        country = storedLocation.country;
      } else {
        // Try to get current position
        try {
          coords = await getCurrentPosition();
          
          // Reverse geocode to get city name
          try {
            const geoResults = await reverseGeocode(coords);
            if (geoResults.length > 0) {
              city = geoResults[0].name;
              country = geoResults[0].country;
            }
          } catch (geoError) {
            console.warn('Reverse geocoding failed:', geoError);
          }

          // Store the location
          setStoredLocation({ ...coords, city, country });
        } catch (locError) {
          console.warn('Location access failed, using default:', locError);
          coords = getDefaultLocation();
          city = 'New York';
          country = 'US';
        }
      }

      // Update location state
      setState((prev) => ({
        ...prev,
        location: {
          coordinates: coords,
          city,
          country,
          displayName: formatLocationName(city, country),
          isLoading: false,
        },
      }));

      // Fetch weather data
      try {
        const [weatherData, forecastData] = await Promise.all([
          fetchWeatherByCoords(coords),
          fetchForecast(coords),
        ]);

        setState((prev) => ({
          ...prev,
          weather: weatherData,
          forecast: forecastData,
          isLoading: false,
        }));
      } catch (weatherError) {
        console.warn('Weather API failed, using demo data:', weatherError);
        // Use demo mode if API fails
        setState((prev) => ({
          ...prev,
          weather: getMockWeatherData(),
          forecast: getMockForecastData(),
          isLoading: false,
          error: 'Using demo data. Add API key for real weather.',
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load data. Please try again.',
        weather: getMockWeatherData(),
        forecast: getMockForecastData(),
      }));
    }
  }, []);

  const refreshWeather = useCallback(async () => {
    if (!state.location.coordinates) return;

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherByCoords(state.location.coordinates),
        fetchForecast(state.location.coordinates),
      ]);

      setState((prev) => ({
        ...prev,
        weather: weatherData,
        forecast: forecastData,
        error: null,
      }));
    } catch (error) {
      console.error('Error refreshing weather:', error);
    }
  }, [state.location.coordinates]);

  const refreshLocation = useCallback(async () => {
    try {
      const coords = await getCurrentPosition();
      const geoResults = await reverseGeocode(coords);
      const city = geoResults[0]?.name;
      const country = geoResults[0]?.country;

      setStoredLocation({ ...coords, city, country });

      setState((prev) => ({
        ...prev,
        location: {
          coordinates: coords,
          city,
          country,
          displayName: formatLocationName(city, country),
          isLoading: false,
        },
      }));

      // Fetch new weather for updated location
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherByCoords(coords),
        fetchForecast(coords),
      ]);

      setState((prev) => ({
        ...prev,
        weather: weatherData,
        forecast: forecastData,
      }));
    } catch (error) {
      console.error('Error refreshing location:', error);
    }
  }, []);

  const setManualLocation = useCallback(
    (coords: Coordinates, city?: string, country?: string) => {
      setStoredLocation({ ...coords, city, country });

      setState((prev) => ({
        ...prev,
        location: {
          coordinates: coords,
          city,
          country,
          displayName: formatLocationName(city, country),
          isLoading: false,
        },
      }));

      // Fetch weather for new location
      fetchWeatherByCoords(coords).then((weatherData) => {
        setState((prev) => ({ ...prev, weather: weatherData }));
      });
      fetchForecast(coords).then((forecastData) => {
        setState((prev) => ({ ...prev, forecast: forecastData }));
      });
    },
    []
  );

  const useDemoMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      weather: getMockWeatherData(),
      forecast: getMockForecastData(),
      isLoading: false,
      error: null,
      location: {
        coordinates: getDefaultLocation(),
        city: 'Demo City',
        country: 'US',
        displayName: 'Demo City, US',
        isLoading: false,
      },
    }));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLocationAndWeather();
  }, [fetchLocationAndWeather]);

  // Auto-refresh weather
  useEffect(() => {
    const interval = setInterval(refreshWeather, REFRESH_INTERVALS.weather);
    return () => clearInterval(interval);
  }, [refreshWeather]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        refreshWeather,
        refreshLocation,
        setManualLocation,
        useDemoMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
