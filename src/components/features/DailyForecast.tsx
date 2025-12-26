'use client';

import React from 'react';
import { DailyForecast } from '@/types';
import { Card } from '@/components/ui';
import { formatDayName, getWeatherIcon } from '@/utils';

interface DailyForecastProps {
  daily: DailyForecast[];
}

export function DailyForecastDisplay({ daily }: DailyForecastProps) {
  return (
    <Card variant="default" padding="md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        5-Day Forecast
      </h3>
      <div className="space-y-3">
        {daily.map((day, index) => {
          const dayName = formatDayName(day.date * 1000);
          const icon = getWeatherIcon(day.conditions[0]?.icon || '01d');
          
          return (
            <div
              key={day.date}
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-center gap-3 min-w-[120px]">
                <span className="text-2xl">{icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {dayName}
                </span>
              </div>
              
              {day.pop > 0 && (
                <span className="text-sm text-blue-500 flex items-center gap-1">
                  💧 {Math.round(day.pop * 100)}%
                </span>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {day.tempMin}°
                </span>
                <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                    style={{
                      width: `${((day.tempMax - day.tempMin) / 30) * 100}%`,
                      marginLeft: `${(day.tempMin / 40) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {day.tempMax}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
