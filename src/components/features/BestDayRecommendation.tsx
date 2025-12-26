'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { DailyForecast, Activity } from '@/types';
import { Card } from '@/components/ui';
import { getWeatherIcon, getMainWeatherCondition } from '@/utils/weather';
import { ACTIVITIES } from '@/constants/activities';

interface BestDayRecommendationProps {
  dailyForecast: DailyForecast[];
  targetActivity?: Activity;
  className?: string;
}

interface DayScore {
  date: Date;
  forecast: DailyForecast;
  score: number;
  reasons: string[];
  activities: Activity[];
}

export function BestDayRecommendation({
  dailyForecast,
  targetActivity,
  className = '',
}: BestDayRecommendationProps) {
  const dayScores = useMemo<DayScore[]>(() => {
    return dailyForecast.map((forecast) => {
      const date = new Date(forecast.date * 1000);
      let score = 100;
      const reasons: string[] = [];
      const weatherType = getMainWeatherCondition(forecast.conditions);

      // Temperature scoring
      const avgTemp = (forecast.tempMin + forecast.tempMax) / 2;
      if (avgTemp >= 18 && avgTemp <= 25) {
        score += 20;
        reasons.push('Perfect temperature');
      } else if (avgTemp < 10 || avgTemp > 32) {
        score -= 30;
        reasons.push('Extreme temperature');
      }

      // Precipitation scoring
      if (forecast.pop > 0.7) {
        score -= 40;
        reasons.push('High rain chance');
      } else if (forecast.pop > 0.3) {
        score -= 20;
        reasons.push('Some rain expected');
      } else if (forecast.pop < 0.1) {
        score += 15;
        reasons.push('No rain expected');
      }

      // Weather condition scoring
      if (weatherType === 'clear') {
        score += 25;
        reasons.push('Clear skies');
      } else if (weatherType === 'clouds') {
        score += 10;
        reasons.push('Partly cloudy');
      } else if (weatherType === 'rain' || weatherType === 'thunderstorm') {
        score -= 40;
        reasons.push('Rainy conditions');
      } else if (weatherType === 'snow') {
        score -= 20;
        if (!reasons.includes('Extreme temperature')) {
          reasons.push('Snowy conditions');
        }
      }

      // Wind scoring
      if (forecast.windSpeed > 10) {
        score -= 15;
        reasons.push('Windy');
      }

      // Humidity scoring
      if (forecast.humidity > 85) {
        score -= 10;
        reasons.push('High humidity');
      }

      // Find suitable activities for this weather
      const suitableActivities = ACTIVITIES.filter((activity) =>
        activity.suitableWeather.includes(weatherType)
      ).slice(0, 5);

      return {
        date,
        forecast,
        score: Math.max(0, Math.min(100, score)),
        reasons: reasons.slice(0, 3),
        activities: suitableActivities,
      };
    });
  }, [dailyForecast]);

  // Sort by score to find best day
  const sortedDays = [...dayScores].sort((a, b) => b.score - a.score);
  const bestDay = sortedDays[0];
  const today = dayScores[0];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-blue-100 dark:bg-blue-900/30';
    if (score >= 40) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <Card variant="default" padding="md" className={className}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Best Day This Week
      </h3>

      {/* Best day highlight */}
      {bestDay && (
        <motion.div
          className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(bestDay.date, 'EEEE')}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {format(bestDay.date, 'MMMM d')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">
                {getWeatherIcon(bestDay.forecast.conditions[0]?.icon || '01d')}
              </span>
              <div className={`px-3 py-1 rounded-full ${getScoreBg(bestDay.score)}`}>
                <span className={`font-bold ${getScoreColor(bestDay.score)}`}>
                  {bestDay.score}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <span className="text-gray-700 dark:text-gray-300">
              {bestDay.forecast.tempMax}° / {bestDay.forecast.tempMin}°
            </span>
            {bestDay.forecast.pop > 0 && (
              <span className="text-blue-500">
                💧 {Math.round(bestDay.forecast.pop * 100)}%
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {bestDay.reasons.map((reason, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300"
              >
                ✓ {reason}
              </span>
            ))}
          </div>

          {bestDay.activities.length > 0 && (
            <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Perfect for:
              </p>
              <div className="flex flex-wrap gap-2">
                {bestDay.activities.slice(0, 4).map((activity) => (
                  <span
                    key={activity.id}
                    className="text-sm px-2 py-1 rounded-lg bg-white dark:bg-gray-800"
                  >
                    {activity.icon} {activity.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Week overview */}
      <div className="space-y-2">
        {dayScores.slice(0, 5).map((day, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-3 p-2 rounded-xl ${
              day === bestDay
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-gray-50 dark:bg-gray-800'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="w-16">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {index === 0 ? 'Today' : format(day.date, 'EEE')}
              </p>
            </div>

            <span className="text-xl">
              {getWeatherIcon(day.forecast.conditions[0]?.icon || '01d')}
            </span>

            <div className="flex-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {day.forecast.tempMax}° / {day.forecast.tempMin}°
              </span>
            </div>

            {/* Score bar */}
            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  day.score >= 80
                    ? 'bg-green-500'
                    : day.score >= 60
                    ? 'bg-blue-500'
                    : day.score >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${day.score}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
            </div>

            <span
              className={`w-8 text-sm font-medium text-right ${getScoreColor(day.score)}`}
            >
              {day.score}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
