'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

interface RainRadarProps {
  precipitationData?: number[]; // Precipitation probability for next 6 hours
  className?: string;
}

export function RainRadar({ precipitationData = [], className = '' }: RainRadarProps) {
  // Use mock data if none provided
  const data = precipitationData.length > 0 
    ? precipitationData 
    : [10, 25, 40, 60, 45, 20];

  const maxPrecip = Math.max(...data, 1);
  const hours = ['Now', '+1h', '+2h', '+3h', '+4h', '+5h'];

  const getBarColor = (value: number) => {
    if (value < 20) return 'from-blue-200 to-blue-300';
    if (value < 40) return 'from-blue-300 to-blue-400';
    if (value < 60) return 'from-blue-400 to-blue-500';
    if (value < 80) return 'from-blue-500 to-blue-600';
    return 'from-blue-600 to-blue-700';
  };

  const getIntensityLabel = (value: number) => {
    if (value < 20) return 'Light';
    if (value < 40) return 'Moderate';
    if (value < 60) return 'Heavy';
    return 'Very Heavy';
  };

  const avgPrecip = data.reduce((a, b) => a + b, 0) / data.length;
  const peakHour = hours[data.indexOf(Math.max(...data))];

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Precipitation Forecast
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Next 6 hours
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Peak at</p>
          <p className="font-semibold text-blue-500">{peakHour}</p>
        </div>
      </div>

      {/* Radar visualization */}
      <div className="relative mb-4">
        {/* Background rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-gray-200 dark:border-gray-700 opacity-30" />
          <div className="absolute w-24 h-24 rounded-full border border-gray-200 dark:border-gray-700 opacity-30" />
          <div className="absolute w-16 h-16 rounded-full border border-gray-200 dark:border-gray-700 opacity-30" />
        </div>

        {/* Center point */}
        <div className="flex items-center justify-center h-36">
          <motion.div
            className="relative w-32 h-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Precipitation arcs */}
            {data.map((value, index) => {
              const angle = (index * 60 - 90) * (Math.PI / 180);
              const radius = 50;
              const barHeight = (value / 100) * 40 + 10;

              return (
                <motion.div
                  key={index}
                  className={`absolute w-3 rounded-full bg-gradient-to-t ${getBarColor(value)}`}
                  style={{
                    height: barHeight,
                    left: `calc(50% + ${Math.cos(angle) * radius}px - 6px)`,
                    bottom: `calc(50% + ${Math.sin(angle) * radius}px)`,
                    transformOrigin: 'bottom center',
                    transform: `rotate(${index * 60}deg)`,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              );
            })}

            {/* Center indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-lg">💧</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-2 h-20 mb-4">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <motion.div
              className={`w-full rounded-t-lg bg-gradient-to-t ${getBarColor(value)}`}
              style={{ height: `${Math.max(10, (value / maxPrecip) * 100)}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      {/* Time labels */}
      <div className="flex justify-between">
        {hours.map((hour, index) => (
          <span
            key={index}
            className="text-xs text-gray-500 dark:text-gray-400"
          >
            {hour}
          </span>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Average chance
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round(avgPrecip)}%
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Expected intensity
          </span>
          <span className="font-medium text-blue-500">
            {getIntensityLabel(Math.max(...data))}
          </span>
        </div>
      </div>
    </Card>
  );
}
