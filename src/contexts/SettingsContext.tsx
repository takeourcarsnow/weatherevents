'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  UserPreferences,
  SavedLocation,
  TemperatureUnit,
  WindSpeedUnit,
  TimeFormat,
  ActivityHistoryEntry,
  DEFAULT_PREFERENCES,
} from '@/types/settings';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { generateId } from '@/utils';

const SETTINGS_STORAGE_KEY = 'weather-planner-settings';
const LOCATIONS_STORAGE_KEY = 'weather-planner-saved-locations';

interface SettingsContextType {
  preferences: UserPreferences;
  savedLocations: SavedLocation[];
  // Preference setters
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setWeatherAlertsEnabled: (enabled: boolean) => void;
  // Favorite activities
  toggleFavoriteActivity: (activityId: string) => void;
  isFavoriteActivity: (activityId: string) => boolean;
  // Activity history
  addActivityToHistory: (entry: Omit<ActivityHistoryEntry, 'date'>) => void;
  getActivityHistory: (activityId?: string) => ActivityHistoryEntry[];
  // Saved locations
  addSavedLocation: (location: Omit<SavedLocation, 'id' | 'createdAt'>) => void;
  removeSavedLocation: (id: string) => void;
  setDefaultLocation: (id: string) => void;
  getDefaultLocation: () => SavedLocation | null;
  // Utility
  resetPreferences: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedPreferences = getStorageItem<UserPreferences>(SETTINGS_STORAGE_KEY);
    const storedLocations = getStorageItem<SavedLocation[]>(LOCATIONS_STORAGE_KEY);

    if (storedPreferences) {
      setPreferences({ ...DEFAULT_PREFERENCES, ...storedPreferences });
    }
    if (storedLocations) {
      setSavedLocations(storedLocations);
    }
    setIsHydrated(true);
  }, []);

  // Persist preferences to localStorage
  useEffect(() => {
    if (isHydrated) {
      setStorageItem(SETTINGS_STORAGE_KEY, preferences);
    }
  }, [preferences, isHydrated]);

  // Persist locations to localStorage
  useEffect(() => {
    if (isHydrated) {
      setStorageItem(LOCATIONS_STORAGE_KEY, savedLocations);
    }
  }, [savedLocations, isHydrated]);

  const setTemperatureUnit = useCallback((unit: TemperatureUnit) => {
    setPreferences((prev) => ({ ...prev, temperatureUnit: unit }));
  }, []);

  const setWindSpeedUnit = useCallback((unit: WindSpeedUnit) => {
    setPreferences((prev) => ({ ...prev, windSpeedUnit: unit }));
  }, []);

  const setTimeFormat = useCallback((format: TimeFormat) => {
    setPreferences((prev) => ({ ...prev, timeFormat: format }));
  }, []);

  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, notificationsEnabled: enabled }));
  }, []);

  const setWeatherAlertsEnabled = useCallback((enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, weatherAlertsEnabled: enabled }));
  }, []);

  const toggleFavoriteActivity = useCallback((activityId: string) => {
    setPreferences((prev) => {
      const favorites = prev.favoriteActivities.includes(activityId)
        ? prev.favoriteActivities.filter((id) => id !== activityId)
        : [...prev.favoriteActivities, activityId];
      return { ...prev, favoriteActivities: favorites };
    });
  }, []);

  const isFavoriteActivity = useCallback(
    (activityId: string) => preferences.favoriteActivities.includes(activityId),
    [preferences.favoriteActivities]
  );

  const addActivityToHistory = useCallback(
    (entry: Omit<ActivityHistoryEntry, 'date'>) => {
      setPreferences((prev) => ({
        ...prev,
        activityHistory: [
          { ...entry, date: new Date().toISOString() },
          ...prev.activityHistory.slice(0, 99), // Keep last 100 entries
        ],
      }));
    },
    []
  );

  const getActivityHistory = useCallback(
    (activityId?: string) => {
      if (!activityId) return preferences.activityHistory;
      return preferences.activityHistory.filter((h) => h.activityId === activityId);
    },
    [preferences.activityHistory]
  );

  const addSavedLocation = useCallback(
    (location: Omit<SavedLocation, 'id' | 'createdAt'>) => {
      const newLocation: SavedLocation = {
        ...location,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setSavedLocations((prev) => {
        // If this is the first location or marked as default, unset others
        if (location.isDefault || prev.length === 0) {
          return [
            { ...newLocation, isDefault: true },
            ...prev.map((loc) => ({ ...loc, isDefault: false })),
          ];
        }
        return [...prev, newLocation];
      });
    },
    []
  );

  const removeSavedLocation = useCallback((id: string) => {
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== id));
  }, []);

  const setDefaultLocation = useCallback((id: string) => {
    setSavedLocations((prev) =>
      prev.map((loc) => ({
        ...loc,
        isDefault: loc.id === id,
      }))
    );
  }, []);

  const getDefaultLocation = useCallback(() => {
    return savedLocations.find((loc) => loc.isDefault) || savedLocations[0] || null;
  }, [savedLocations]);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    setSavedLocations([]);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        preferences,
        savedLocations,
        setTemperatureUnit,
        setWindSpeedUnit,
        setTimeFormat,
        setNotificationsEnabled,
        setWeatherAlertsEnabled,
        toggleFavoriteActivity,
        isFavoriteActivity,
        addActivityToHistory,
        getActivityHistory,
        addSavedLocation,
        removeSavedLocation,
        setDefaultLocation,
        getDefaultLocation,
        resetPreferences,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
