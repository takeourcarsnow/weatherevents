'use client';

import React from 'react';
import { WeatherData } from '@/types';
import { Card } from '@/components/ui';
import { formatTime, getWindDescription } from '@/utils';

interface WeatherDetailsProps {
  weather: WeatherData;
}

export function WeatherDetails({ weather }: WeatherDetailsProps) {
  const details = [
    {
      icon: '💧',
      label: 'Humidity',
      value: `${weather.humidity}%`,
    },
    {
      icon: '💨',
      label: 'Wind',
      value: `${weather.windSpeed.toFixed(1)} m/s`,
      subtitle: getWindDescription(weather.windSpeed),
    },
    {
      icon: '👁️',
      label: 'Visibility',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
    },
    {
      icon: '🌡️',
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
    },
    {
      icon: '🌅',
      label: 'Sunrise',
      value: formatTime(weather.sunrise, weather.timezone),
    },
    {
      icon: '🌇',
      label: 'Sunset',
      value: formatTime(weather.sunset, weather.timezone),
    },
  ];

  return (
    <Card variant="default" padding="md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Weather Details
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50"
          >
            <span className="text-2xl mb-1">{detail.icon}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {detail.label}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {detail.value}
            </span>
            {detail.subtitle && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {detail.subtitle}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
