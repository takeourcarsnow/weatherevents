'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format, addHours, isAfter, isBefore, setHours } from 'date-fns';
import { HourlyForecast } from '@/types';
import { Card } from '@/components/ui';
import { getWeatherIcon } from '@/utils/weather';

interface WeatherTimelineProps {
  hourlyForecast: HourlyForecast[];
  sunrise: number;
  sunset: number;
  className?: string;
}

interface TimeSlot {
  time: Date;
  hour: number;
  weather: HourlyForecast;
  isDay: boolean;
  activityWindow: 'optimal' | 'good' | 'fair' | 'poor';
}

export function WeatherTimeline({
  hourlyForecast,
  sunrise,
  sunset,
  className = '',
}: WeatherTimelineProps) {
  const now = new Date();
  const sunriseDate = new Date(sunrise * 1000);
  const sunsetDate = new Date(sunset * 1000);

  // Create time slots for the next 24 hours
  const timeSlots: TimeSlot[] = hourlyForecast.slice(0, 8).map((forecast) => {
    const time = new Date(forecast.time * 1000);
    const isDay = isAfter(time, sunriseDate) && isBefore(time, sunsetDate);

    // Determine activity window based on weather
    let activityWindow: TimeSlot['activityWindow'] = 'optimal';
    const condition = forecast.conditions[0]?.main.toLowerCase() || '';

    if (condition.includes('rain') || condition.includes('thunder') || condition.includes('snow')) {
      activityWindow = 'poor';
    } else if (condition.includes('drizzle') || condition.includes('mist')) {
      activityWindow = 'fair';
    } else if (condition.includes('cloud')) {
      activityWindow = 'good';
    }

    // Adjust based on precipitation probability
    if (forecast.pop > 0.5) {
      activityWindow = activityWindow === 'optimal' ? 'good' : activityWindow === 'good' ? 'fair' : 'poor';
    }

    return {
      time,
      hour: time.getHours(),
      weather: forecast,
      isDay,
      activityWindow,
    };
  });

  const getActivityColor = (window: TimeSlot['activityWindow']) => {
    switch (window) {
      case 'optimal':
        return 'bg-green-400';
      case 'good':
        return 'bg-blue-400';
      case 'fair':
        return 'bg-yellow-400';
      case 'poor':
        return 'bg-red-400';
    }
  };

  const getActivityLabel = (window: TimeSlot['activityWindow']) => {
    switch (window) {
      case 'optimal':
        return 'Perfect for outdoors';
      case 'good':
        return 'Good conditions';
      case 'fair':
        return 'Fair, check forecast';
      case 'poor':
        return 'Indoor activities recommended';
    }
  };

  // Find best outdoor window
  const bestWindow = timeSlots.find((slot) => slot.activityWindow === 'optimal' && slot.isDay);

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Activity Timeline
        </h3>
        {bestWindow && (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
            Best: {format(bestWindow.time, 'h a')}
          </span>
        )}
      </div>

      {/* Timeline bar */}
      <div className="relative mb-6">
        <div className="flex rounded-full overflow-hidden h-3">
          {timeSlots.map((slot, index) => (
            <motion.div
              key={index}
              className={`flex-1 ${getActivityColor(slot.activityWindow)} ${
                !slot.isDay ? 'opacity-50' : ''
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.05 }}
            />
          ))}
        </div>

        {/* Time markers */}
        <div className="flex justify-between mt-2">
          {timeSlots.filter((_, i) => i % 2 === 0).map((slot, index) => (
            <span
              key={index}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {format(slot.time, 'h a')}
            </span>
          ))}
        </div>
      </div>

      {/* Detailed slots */}
      <div className="space-y-2">
        {timeSlots.slice(0, 4).map((slot, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-12 text-center">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {format(slot.time, 'h a')}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <span className="text-2xl">{getWeatherIcon(slot.weather.conditions[0]?.icon || '01d')}</span>
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {slot.weather.temperature}°
                </span>
                {slot.weather.pop > 0 && (
                  <span className="text-xs text-blue-500 ml-2">
                    💧 {Math.round(slot.weather.pop * 100)}%
                  </span>
                )}
              </div>
            </div>

            <div className={`w-3 h-3 rounded-full ${getActivityColor(slot.activityWindow)}`} />
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {(['optimal', 'good', 'fair', 'poor'] as const).map((level) => (
          <div key={level} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getActivityColor(level)}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{level}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
