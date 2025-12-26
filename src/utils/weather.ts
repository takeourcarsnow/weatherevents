// Weather utility functions
import { WeatherType, WeatherData, WeatherApiResponse, WeatherCondition } from '@/types';
import { WEATHER_ICONS, WEATHER_MESSAGES, WEATHER_BACKGROUNDS } from '@/constants';

export function getWeatherType(condition: string): WeatherType {
  const normalizedCondition = condition.toLowerCase();
  
  const weatherMap: Record<string, WeatherType> = {
    clear: 'clear',
    clouds: 'clouds',
    rain: 'rain',
    drizzle: 'drizzle',
    thunderstorm: 'thunderstorm',
    snow: 'snow',
    mist: 'mist',
    fog: 'fog',
    haze: 'haze',
    dust: 'dust',
    sand: 'sand',
    ash: 'ash',
    squall: 'squall',
    tornado: 'tornado',
  };

  return weatherMap[normalizedCondition] || 'clear';
}

export function getWeatherIcon(iconCode: string): string {
  return WEATHER_ICONS[iconCode] || '🌡️';
}

export function getWeatherMessage(weatherType: WeatherType): string {
  return WEATHER_MESSAGES[weatherType] || 'Check activities for today!';
}

export function getWeatherBackground(weatherType: WeatherType): string {
  return WEATHER_BACKGROUNDS[weatherType] || WEATHER_BACKGROUNDS.clear;
}

export function parseWeatherData(data: WeatherApiResponse): WeatherData {
  return {
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    conditions: data.weather.map((w) => ({
      id: w.id,
      main: w.main,
      description: w.description,
      icon: w.icon,
    })),
    visibility: data.visibility,
    pressure: data.main.pressure,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
    cityName: data.name,
    country: data.sys.country,
  };
}

export function getMainWeatherCondition(conditions: WeatherCondition[]): WeatherType {
  if (conditions.length === 0) return 'clear';
  return getWeatherType(conditions[0].main);
}

export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    return `${Math.round((temp * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function getUVIndexLevel(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

export function getWindDescription(speedMs: number): string {
  const speedKmh = speedMs * 3.6;
  if (speedKmh < 1) return 'Calm';
  if (speedKmh < 6) return 'Light air';
  if (speedKmh < 12) return 'Light breeze';
  if (speedKmh < 20) return 'Gentle breeze';
  if (speedKmh < 29) return 'Moderate breeze';
  if (speedKmh < 39) return 'Fresh breeze';
  if (speedKmh < 50) return 'Strong breeze';
  if (speedKmh < 62) return 'Near gale';
  if (speedKmh < 75) return 'Gale';
  if (speedKmh < 89) return 'Strong gale';
  return 'Storm';
}

export function isGoodWeatherForOutdoor(weatherType: WeatherType): boolean {
  const goodWeather: WeatherType[] = ['clear', 'clouds'];
  return goodWeather.includes(weatherType);
}

export function shouldSuggestIndoorActivities(weatherType: WeatherType): boolean {
  const indoorWeather: WeatherType[] = [
    'rain',
    'drizzle',
    'thunderstorm',
    'snow',
    'mist',
    'fog',
    'haze',
    'dust',
    'sand',
    'ash',
    'squall',
    'tornado',
  ];
  return indoorWeather.includes(weatherType);
}
