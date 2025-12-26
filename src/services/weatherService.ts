// Weather API service
import { WeatherData, ForecastData, Coordinates, WeatherApiResponse, ForecastApiResponse } from '@/types';
import { parseWeatherData } from '@/utils';
import { API_CONFIG } from '@/constants';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';

interface WeatherServiceOptions {
  units?: 'metric' | 'imperial';
  lang?: string;
}

export async function fetchWeatherByCoords(
  coords: Coordinates,
  options: WeatherServiceOptions = {}
): Promise<WeatherData> {
  const { units = API_CONFIG.defaultUnits, lang = API_CONFIG.defaultLang } = options;
  
  const url = new URL(`${API_CONFIG.weatherApiBaseUrl}/weather`);
  url.searchParams.append('lat', coords.latitude.toString());
  url.searchParams.append('lon', coords.longitude.toString());
  url.searchParams.append('units', units);
  url.searchParams.append('lang', lang);
  url.searchParams.append('appid', WEATHER_API_KEY);

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data: WeatherApiResponse = await response.json();
  return parseWeatherData(data);
}

export async function fetchWeatherByCity(
  city: string,
  options: WeatherServiceOptions = {}
): Promise<WeatherData> {
  const { units = API_CONFIG.defaultUnits, lang = API_CONFIG.defaultLang } = options;
  
  const url = new URL(`${API_CONFIG.weatherApiBaseUrl}/weather`);
  url.searchParams.append('q', city);
  url.searchParams.append('units', units);
  url.searchParams.append('lang', lang);
  url.searchParams.append('appid', WEATHER_API_KEY);

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data: WeatherApiResponse = await response.json();
  return parseWeatherData(data);
}

export async function fetchForecast(
  coords: Coordinates,
  options: WeatherServiceOptions = {}
): Promise<ForecastData> {
  const { units = API_CONFIG.defaultUnits, lang = API_CONFIG.defaultLang } = options;
  
  const url = new URL(`${API_CONFIG.weatherApiBaseUrl}/forecast`);
  url.searchParams.append('lat', coords.latitude.toString());
  url.searchParams.append('lon', coords.longitude.toString());
  url.searchParams.append('units', units);
  url.searchParams.append('lang', lang);
  url.searchParams.append('appid', WEATHER_API_KEY);

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.status}`);
  }

  const data: ForecastApiResponse = await response.json();
  return parseForecastData(data);
}

function parseForecastData(data: ForecastApiResponse): ForecastData {
  // Get hourly forecasts (next 24 hours, every 3 hours)
  const hourly = data.list.slice(0, 8).map((item) => ({
    time: item.dt,
    temperature: Math.round(item.main.temp),
    conditions: item.weather.map((w) => ({
      id: w.id,
      main: w.main,
      description: w.description,
      icon: w.icon,
    })),
    pop: item.pop,
  }));

  // Get daily forecasts (group by day)
  const dailyMap = new Map<string, typeof data.list>();
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });

  const daily = Array.from(dailyMap.entries())
    .slice(0, 5)
    .map(([_, items]) => {
      const temps = items.map((i) => i.main.temp);
      const middleItem = items[Math.floor(items.length / 2)];
      
      return {
        date: items[0].dt,
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        conditions: middleItem.weather.map((w) => ({
          id: w.id,
          main: w.main,
          description: w.description,
          icon: w.icon,
        })),
        pop: Math.max(...items.map((i) => i.pop)),
        humidity: middleItem.main.humidity,
        windSpeed: middleItem.wind.speed,
      };
    });

  return { hourly, daily };
}

// Mock weather for demo/development without API key
export function getMockWeatherData(): WeatherData {
  return {
    temperature: 22,
    feelsLike: 24,
    humidity: 65,
    windSpeed: 3.5,
    conditions: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    visibility: 10000,
    pressure: 1013,
    sunrise: Math.floor(Date.now() / 1000) - 21600,
    sunset: Math.floor(Date.now() / 1000) + 21600,
    timezone: 0,
    cityName: 'Demo City',
    country: 'US',
  };
}

export function getMockForecastData(): ForecastData {
  const now = Math.floor(Date.now() / 1000);
  
  return {
    hourly: Array.from({ length: 8 }, (_, i) => ({
      time: now + i * 3600 * 3,
      temperature: 20 + Math.round(Math.random() * 10),
      conditions: [
        {
          id: 800,
          main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
          description: 'weather condition',
          icon: ['01d', '02d', '10d'][Math.floor(Math.random() * 3)],
        },
      ],
      pop: Math.random() * 0.5,
    })),
    daily: Array.from({ length: 5 }, (_, i) => ({
      date: now + i * 86400,
      tempMin: 15 + Math.round(Math.random() * 5),
      tempMax: 25 + Math.round(Math.random() * 5),
      conditions: [
        {
          id: 800,
          main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
          description: 'weather condition',
          icon: ['01d', '02d', '10d'][Math.floor(Math.random() * 3)],
        },
      ],
      pop: Math.random() * 0.5,
      humidity: 50 + Math.round(Math.random() * 30),
      windSpeed: 2 + Math.random() * 5,
    })),
  };
}
