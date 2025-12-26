'use client';

import React from 'react';
import { WeatherData } from '@/types';
import { Card } from '@/components/ui';
import { getWeatherIcon, getWeatherType, getWeatherBackground, getWeatherMessage } from '@/utils';
import { cn } from '@/utils/cn';

interface WeatherDisplayProps {
  weather: WeatherData;
  compact?: boolean;
}

export function WeatherDisplay({ weather, compact = false }: WeatherDisplayProps) {
  const weatherType = getWeatherType(weather.conditions[0]?.main || 'clear');
  const background = getWeatherBackground(weatherType);
  const icon = getWeatherIcon(weather.conditions[0]?.icon || '01d');
  const message = getWeatherMessage(weatherType);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {weather.temperature}°
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
        `bg-gradient-to-br ${background}`
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-20">
        <div className="absolute inset-0 rounded-full bg-white/30 blur-3xl transform translate-x-10 -translate-y-10" />
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="text-7xl font-light mb-2">{weather.temperature}°</div>
          <p className="text-xl capitalize mb-1">{weather.conditions[0]?.description}</p>
          <p className="text-sm opacity-80">Feels like {weather.feelsLike}°</p>
        </div>
        <span className="text-7xl">{icon}</span>
      </div>

      {/* Weather message */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <p className="text-sm font-medium">{message}</p>
      </div>
    </Card>
  );
}
