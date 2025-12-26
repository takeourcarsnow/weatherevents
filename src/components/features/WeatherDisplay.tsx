'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '@/types';
import { Card } from '@/components/ui';
import { getWeatherIcon, getWeatherType, getWeatherBackground, getWeatherMessage } from '@/utils';
import { getWeatherGradientClass } from '@/contexts';
import { cn } from '@/utils/cn';
import { useSettings } from '@/contexts/SettingsContext';

interface WeatherDisplayProps {
  weather: WeatherData;
  compact?: boolean;
}

export function WeatherDisplay({ weather, compact = false }: WeatherDisplayProps) {
  const { preferences } = useSettings();
  const weatherType = getWeatherType(weather.conditions[0]?.main || 'clear');
  const icon = getWeatherIcon(weather.conditions[0]?.icon || '01d');
  const message = getWeatherMessage(weatherType);
  
  // Determine if it's daytime based on sunrise/sunset
  const isDaytime = useMemo(() => {
    const now = Date.now() / 1000;
    return now >= weather.sunrise && now <= weather.sunset;
  }, [weather.sunrise, weather.sunset]);

  // Get dynamic gradient based on weather
  const gradientClass = getWeatherGradientClass(weatherType, isDaytime);

  // Format temperature based on user preference
  const displayTemp = useMemo(() => {
    if (preferences.temperatureUnit === 'fahrenheit') {
      return Math.round((weather.temperature * 9) / 5 + 32);
    }
    return weather.temperature;
  }, [weather.temperature, preferences.temperatureUnit]);

  const displayFeelsLike = useMemo(() => {
    if (preferences.temperatureUnit === 'fahrenheit') {
      return Math.round((weather.feelsLike * 9) / 5 + 32);
    }
    return weather.feelsLike;
  }, [weather.feelsLike, preferences.temperatureUnit]);

  const tempUnit = preferences.temperatureUnit === 'fahrenheit' ? '°F' : '°C';

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <motion.span
          className="text-3xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {icon}
        </motion.span>
        <div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {displayTemp}{tempUnit}
          </span>
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {weather.conditions[0]?.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card
      variant="glass"
      padding="lg"
      className={cn(
        'relative overflow-hidden text-white',
        `bg-gradient-to-br ${gradientClass}`
      )}
    >
      {/* Animated background decoration */}
      <motion.div
        className="absolute top-0 right-0 w-40 h-40 opacity-20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white/30 blur-3xl transform translate-x-10 -translate-y-10" />
      </motion.div>

      {/* Day/Night indicator */}
      <motion.div
        className="absolute top-4 right-4 text-sm opacity-70 flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
      >
        {isDaytime ? '☀️' : '🌙'} {isDaytime ? 'Day' : 'Night'}
      </motion.div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="font-medium">
          {weather.cityName}, {weather.country}
        </span>
      </div>

      {/* Main weather info */}
      <div className="flex items-start justify-between">
        <div>
          <motion.div
            className="text-7xl font-light mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={displayTemp}
          >
            {displayTemp}
            <span className="text-4xl">{tempUnit}</span>
          </motion.div>
          <p className="text-xl capitalize mb-1">{weather.conditions[0]?.description}</p>
          <p className="text-sm opacity-80">Feels like {displayFeelsLike}{tempUnit}</p>
        </div>
        <motion.span
          className="text-7xl"
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {icon}
        </motion.span>
      </div>

      {/* Weather message */}
      <motion.div
        className="mt-6 pt-4 border-t border-white/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm font-medium">{message}</p>
      </motion.div>
    </Card>
  );
}
