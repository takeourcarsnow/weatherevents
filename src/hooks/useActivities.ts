'use client';

import { useMemo } from 'react';
import { ActivitySuggestion, WeatherType } from '@/types';
import { getSuggestedActivities, filterActivitiesByCategory } from '@/utils';
import { useApp } from '@/contexts';
import { getMainWeatherCondition } from '@/utils/weather';

interface UseActivitiesReturn {
  suggestions: ActivitySuggestion[];
  weatherType: WeatherType;
  isOutdoorWeather: boolean;
  getFilteredActivities: (category: string) => ActivitySuggestion[];
}

export function useActivities(): UseActivitiesReturn {
  const { weather } = useApp();

  const weatherType = useMemo((): WeatherType => {
    if (!weather?.conditions) return 'clear';
    return getMainWeatherCondition(weather.conditions);
  }, [weather?.conditions]);

  const suggestions = useMemo(() => {
    return getSuggestedActivities(weatherType, 12);
  }, [weatherType]);

  const isOutdoorWeather = useMemo(() => {
    const outdoorTypes: WeatherType[] = ['clear', 'clouds'];
    return outdoorTypes.includes(weatherType);
  }, [weatherType]);

  const getFilteredActivities = (category: string): ActivitySuggestion[] => {
    return filterActivitiesByCategory(suggestions, category);
  };

  return {
    suggestions,
    weatherType,
    isOutdoorWeather,
    getFilteredActivities,
  };
}
