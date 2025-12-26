'use client';

import React, { useState } from 'react';
import { useTheme, useApp, useSettings } from '@/contexts';
import { PageContainer, Section } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { ActivityHistoryDisplay } from '@/components/features';
import { ACTIVITIES } from '@/constants/activities';
import { motion, AnimatePresence } from 'framer-motion';
import { TemperatureUnit, WindSpeedUnit, TimeFormat, SavedLocation } from '@/types/settings';

export function SettingsView() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { location, useDemoMode, setManualLocation } = useApp();
  const {
    preferences,
    savedLocations,
    setTemperatureUnit,
    setWindSpeedUnit,
    setTimeFormat,
    setNotificationsEnabled,
    setWeatherAlertsEnabled,
    addSavedLocation,
    removeSavedLocation,
    setDefaultLocation,
    resetPreferences,
  } = useSettings();

  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');

  const themeOptions = [
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
    { id: 'system', label: 'System', icon: '💻' },
  ] as const;

  const tempUnits: { id: TemperatureUnit; label: string }[] = [
    { id: 'celsius', label: '°C' },
    { id: 'fahrenheit', label: '°F' },
  ];

  const windUnits: { id: WindSpeedUnit; label: string }[] = [
    { id: 'ms', label: 'm/s' },
    { id: 'kmh', label: 'km/h' },
    { id: 'mph', label: 'mph' },
  ];

  const timeFormats: { id: TimeFormat; label: string }[] = [
    { id: '24h', label: '24-hour' },
    { id: '12h', label: '12-hour' },
  ];

  const handleSaveCurrentLocation = () => {
    if (location.coordinates && newLocationName.trim()) {
      addSavedLocation({
        name: newLocationName.trim(),
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
        city: location.city || 'Unknown',
        country: location.country || 'Unknown',
        isDefault: savedLocations.length === 0,
      });
      setNewLocationName('');
      setShowAddLocation(false);
    }
  };

  const handleSelectLocation = (loc: SavedLocation) => {
    setManualLocation(
      { latitude: loc.latitude, longitude: loc.longitude },
      loc.city,
      loc.country
    );
    setDefaultLocation(loc.id);
  };

  return (
    <PageContainer>
      <Section title="Settings">
        {/* Theme Selection */}
        <Card variant="default" padding="md" className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  theme === option.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label={`Select ${option.label} theme`}
              >
                <span className="text-2xl">{option.icon}</span>
                <span
                  className={`text-sm font-medium ${
                    theme === option.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Current: {resolvedTheme === 'dark' ? 'Dark' : 'Light'} mode
          </p>
        </Card>

        {/* Units */}
        <Card variant="default" padding="md" className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Units
          </h3>
          
          {/* Temperature Unit */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
              Temperature
            </label>
            <div className="flex gap-2">
              {tempUnits.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setTemperatureUnit(unit.id)}
                  className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                    preferences.temperatureUnit === unit.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  aria-pressed={preferences.temperatureUnit === unit.id}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
              Wind Speed
            </label>
            <div className="flex gap-2">
              {windUnits.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setWindSpeedUnit(unit.id)}
                  className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                    preferences.windSpeedUnit === unit.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  aria-pressed={preferences.windSpeedUnit === unit.id}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Format */}
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
              Time Format
            </label>
            <div className="flex gap-2">
              {timeFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setTimeFormat(format.id)}
                  className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                    preferences.timeFormat === format.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  aria-pressed={preferences.timeFormat === format.id}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card variant="default" padding="md" className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive activity reminders
                </p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!preferences.notificationsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={preferences.notificationsEnabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Weather Alerts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Severe weather warnings
                </p>
              </div>
              <button
                onClick={() => setWeatherAlertsEnabled(!preferences.weatherAlertsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.weatherAlertsEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={preferences.weatherAlertsEnabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.weatherAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Saved Locations */}
        <Card variant="default" padding="md" className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Saved Locations
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAddLocation(!showAddLocation)}
            >
              {showAddLocation ? 'Cancel' : '+ Add'}
            </Button>
          </div>

          <AnimatePresence>
            {showAddLocation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Save current location ({location.displayName})
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      placeholder="Location name (e.g., Home)"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <Button size="sm" onClick={handleSaveCurrentLocation}>
                      Save
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {savedLocations.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No saved locations yet
            </p>
          ) : (
            <div className="space-y-2">
              {savedLocations.map((loc) => (
                <motion.div
                  key={loc.id}
                  layout
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    loc.isDefault
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <button
                    onClick={() => handleSelectLocation(loc)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {loc.name}
                          {loc.isDefault && (
                            <span className="ml-2 text-xs text-blue-500">Default</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {loc.city}, {loc.country}
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => removeSavedLocation(loc.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${loc.name}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Current Location Info */}
        <Card variant="default" padding="md" className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Current Location
          </h3>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {location.displayName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </Card>

        {/* Activity History */}
        <ActivityHistoryDisplay activities={ACTIVITIES} className="mb-4" />

        {/* Data Options */}
        <Card variant="default" padding="md" className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Data
          </h3>
          <div className="space-y-3">
            <Button variant="secondary" onClick={useDemoMode} className="w-full justify-start">
              <span className="mr-3">🎮</span>
              Use Demo Mode
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (confirm('Reset all preferences to defaults?')) {
                  resetPreferences();
                }
              }}
              className="w-full justify-start text-red-500 hover:text-red-600"
            >
              <span className="mr-3">🗑️</span>
              Reset All Preferences
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Demo mode uses sample data for testing without an API key.
            </p>
          </div>
        </Card>

        {/* About */}
        <Card variant="default" padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            About
          </h3>
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🌤️</div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              WeatherPlanner
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Version 2.0.0
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-xs mx-auto">
              Plan your day based on weather conditions. Get activity suggestions, track your history, and find local events.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                PWA Ready
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                Offline Support
              </span>
            </div>
          </div>
        </Card>
      </Section>
    </PageContainer>
  );
}
