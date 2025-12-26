// Activity utility functions
import { Activity, ActivitySuggestion, WeatherType } from '@/types';
import { ACTIVITIES } from '@/constants';
import { isGoodWeatherForOutdoor } from './weather';

export function getActivitiesForWeather(weatherType: WeatherType): Activity[] {
  return ACTIVITIES.filter((activity) => 
    activity.suitableWeather.includes(weatherType)
  );
}

export function getSuggestedActivities(
  weatherType: WeatherType,
  limit: number = 6
): ActivitySuggestion[] {
  const suitableActivities = getActivitiesForWeather(weatherType);
  const isOutdoorWeather = isGoodWeatherForOutdoor(weatherType);

  // Score activities based on weather match
  const scoredActivities: ActivitySuggestion[] = suitableActivities.map((activity) => {
    let score = 50; // Base score

    // Bonus for matching indoor/outdoor preference
    if (isOutdoorWeather && !activity.indoor) {
      score += 30;
    } else if (!isOutdoorWeather && activity.indoor) {
      score += 30;
    }

    // Bonus for family-friendly activities
    if (activity.familyFriendly) {
      score += 10;
    }

    // Bonus for free activities
    if (activity.priceRange === 'free') {
      score += 10;
    }

    return {
      activity,
      reason: generateActivityReason(activity, weatherType),
      matchScore: Math.min(score, 100),
    };
  });

  // Sort by score and return top activities
  return scoredActivities
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

function generateActivityReason(activity: Activity, weatherType: WeatherType): string {
  const weatherReasons: Record<string, string> = {
    clear: 'Perfect sunny weather',
    clouds: 'Nice weather with light clouds',
    rain: 'Stay dry and cozy',
    drizzle: 'Escape the light rain',
    thunderstorm: 'Safe from the storm',
    snow: 'Embrace the winter',
    mist: 'Good visibility indoors',
    fog: 'Avoid low visibility',
    haze: 'Better air quality indoors',
    dust: 'Cleaner environment',
    sand: 'Protected from particles',
    ash: 'Safe indoor air',
    squall: 'Shelter from winds',
    tornado: 'Stay safe inside',
  };

  const activityBenefits: Record<string, string> = {
    outdoor: 'Great for fresh air',
    indoor: 'Perfect indoor escape',
    cultural: 'Expand your horizons',
    sports: 'Stay active and healthy',
    relaxation: 'Unwind and recharge',
    food: 'Treat your taste buds',
    shopping: 'Retail therapy awaits',
    entertainment: 'Fun and excitement',
    nature: 'Connect with nature',
    fitness: 'Boost your energy',
  };

  const weatherReason = weatherReasons[weatherType] || 'Great for today';
  const benefit = activityBenefits[activity.category] || 'Enjoy your day';

  return `${weatherReason}. ${benefit}.`;
}

export function filterActivitiesByCategory(
  activities: ActivitySuggestion[],
  category: string
): ActivitySuggestion[] {
  if (category === 'all') return activities;
  if (category === 'indoor') {
    return activities.filter((s) => s.activity.indoor);
  }
  if (category === 'outdoor') {
    return activities.filter((s) => !s.activity.indoor);
  }
  return activities.filter((s) => s.activity.category === category);
}

export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find((activity) => activity.id === id);
}

export function searchActivities(query: string): Activity[] {
  const lowerQuery = query.toLowerCase();
  return ACTIVITIES.filter(
    (activity) =>
      activity.name.toLowerCase().includes(lowerQuery) ||
      activity.description.toLowerCase().includes(lowerQuery) ||
      activity.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
