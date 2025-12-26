'use client';

import React from 'react';
import { HourlyForecast } from '@/types';
import { Card } from '@/components/ui';
import { formatHour, getHourFromTimestamp, getWeatherIcon } from '@/utils';

interface HourlyForecastProps {
  hourly: HourlyForecast[];
}

export function HourlyForecastDisplay({ hourly }: HourlyForecastProps) {
  return (
    <Card variant="default" padding="md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Hourly Forecast
      </h3>
      <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
        <div className="flex gap-3 pb-2 min-w-max">
          {hourly.map((hour, index) => {
            const hourNum = getHourFromTimestamp(hour.time);
            const icon = getWeatherIcon(hour.conditions[0]?.icon || '01d');
            
            return (
              <div
                key={hour.time}
                className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 min-w-[80px]"
              >
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {index === 0 ? 'Now' : formatHour(hourNum)}
                </span>
                <span className="text-2xl mb-2">{icon}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {hour.temperature}°
                </span>
                {hour.pop > 0 && (
                  <span className="text-xs text-blue-500 mt-1">
                    💧 {Math.round(hour.pop * 100)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
