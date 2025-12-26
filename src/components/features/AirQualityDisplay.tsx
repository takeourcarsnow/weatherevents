'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AirQualityData } from '@/types/settings';
import { Card } from '@/components/ui';

interface AirQualityDisplayProps {
  data: AirQualityData;
  className?: string;
}

export function AirQualityDisplay({ data, className = '' }: AirQualityDisplayProps) {
  const getAqiColor = (aqi: number) => {
    const colors = [
      'from-green-400 to-green-500', // Good
      'from-yellow-400 to-yellow-500', // Fair
      'from-orange-400 to-orange-500', // Moderate
      'from-red-400 to-red-500', // Poor
      'from-purple-400 to-purple-500', // Very Poor
    ];
    return colors[aqi - 1] || colors[0];
  };

  const getAqiTextColor = (aqi: number) => {
    const colors = [
      'text-green-600 dark:text-green-400',
      'text-yellow-600 dark:text-yellow-400',
      'text-orange-600 dark:text-orange-400',
      'text-red-600 dark:text-red-400',
      'text-purple-600 dark:text-purple-400',
    ];
    return colors[aqi - 1] || colors[0];
  };

  const getRecommendation = (aqi: number) => {
    const recommendations = [
      'Air quality is excellent. Great for outdoor activities!',
      'Air quality is acceptable. Sensitive groups should limit prolonged outdoor exposure.',
      'Some pollutants may affect sensitive groups. Consider reducing intense outdoor activities.',
      'Health effects possible for everyone. Limit outdoor activities.',
      'Health alert! Avoid outdoor activities.',
    ];
    return recommendations[aqi - 1] || recommendations[0];
  };

  const pollutants = [
    { key: 'pm2_5', label: 'PM2.5', value: data.pm2_5, unit: 'μg/m³' },
    { key: 'pm10', label: 'PM10', value: data.pm10, unit: 'μg/m³' },
    { key: 'o3', label: 'O₃', value: data.o3, unit: 'μg/m³' },
    { key: 'no2', label: 'NO₂', value: data.no2, unit: 'μg/m³' },
  ];

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Air Quality
          </h3>
          <p className={`text-sm font-medium ${getAqiTextColor(data.aqi)}`}>
            {data.aqiLabel}
          </p>
        </div>
        <motion.div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAqiColor(data.aqi)} flex items-center justify-center`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <span className="text-2xl font-bold text-white">{data.aqi}</span>
        </motion.div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {getRecommendation(data.aqi)}
      </p>

      <div className="grid grid-cols-4 gap-2">
        {pollutants.map((pollutant) => (
          <div
            key={pollutant.key}
            className="text-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {pollutant.label}
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {pollutant.value.toFixed(1)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// UV Index Display
interface UVIndexDisplayProps {
  uvIndex: number;
  className?: string;
}

export function UVIndexDisplay({ uvIndex, className = '' }: UVIndexDisplayProps) {
  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-600' };
    if (uv <= 5) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    if (uv <= 7) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-600' };
    if (uv <= 10) return { level: 'Very High', color: 'bg-red-500', textColor: 'text-red-600' };
    return { level: 'Extreme', color: 'bg-purple-500', textColor: 'text-purple-600' };
  };

  const getRecommendation = (uv: number) => {
    if (uv <= 2) return 'No protection needed';
    if (uv <= 5) return 'Wear sunglasses on bright days';
    if (uv <= 7) return 'Wear sunscreen, hat, and sunglasses';
    if (uv <= 10) return 'Avoid midday sun, seek shade';
    return 'Take all precautions, avoid being outside';
  };

  const { level, color, textColor } = getUVLevel(uvIndex);

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 ${className}`}>
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
        <span className="text-lg font-bold text-white">{Math.round(uvIndex)}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">UV Index</span>
          <span className={`text-sm font-medium ${textColor} dark:opacity-80`}>{level}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{getRecommendation(uvIndex)}</p>
      </div>
    </div>
  );
}
