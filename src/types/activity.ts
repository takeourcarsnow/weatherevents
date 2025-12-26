// Activity-related types
import { WeatherType } from './weather';

export type ActivityCategory = 
  | 'outdoor'
  | 'indoor'
  | 'cultural'
  | 'sports'
  | 'relaxation'
  | 'food'
  | 'shopping'
  | 'entertainment'
  | 'nature'
  | 'fitness';

export type ActivityIntensity = 'low' | 'medium' | 'high';

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: ActivityCategory;
  intensity: ActivityIntensity;
  duration: string; // e.g., "1-2 hours"
  suitableWeather: WeatherType[];
  icon: string;
  tags: string[];
  indoor: boolean;
  familyFriendly: boolean;
  priceRange?: '$' | '$$' | '$$$' | 'free';
}

export interface ActivitySuggestion {
  activity: Activity;
  reason: string;
  matchScore: number; // 0-100
  bestTime?: string;
}

export interface DayPlan {
  morning: ActivitySuggestion[];
  afternoon: ActivitySuggestion[];
  evening: ActivitySuggestion[];
  weatherSummary: string;
  date: Date;
}
