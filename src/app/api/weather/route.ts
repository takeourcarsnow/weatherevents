import { NextRequest, NextResponse } from 'next/server';

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const units = searchParams.get('units') || 'metric';

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing latitude or longitude' },
      { status: 400 }
    );
  }

  if (!WEATHER_API_KEY) {
    // Return mock data if no API key
    return NextResponse.json(getMockWeatherResponse());
  }

  try {
    const url = new URL(`${BASE_URL}/weather`);
    url.searchParams.append('lat', lat);
    url.searchParams.append('lon', lon);
    url.searchParams.append('units', units);
    url.searchParams.append('appid', WEATHER_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(getMockWeatherResponse());
  }
}

function getMockWeatherResponse() {
  return {
    coord: { lon: -74.006, lat: 40.7128 },
    weather: [
      { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    ],
    main: {
      temp: 22,
      feels_like: 24,
      temp_min: 20,
      temp_max: 25,
      pressure: 1013,
      humidity: 65,
    },
    visibility: 10000,
    wind: { speed: 3.5, deg: 180 },
    clouds: { all: 0 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      type: 1,
      id: 1,
      country: 'US',
      sunrise: Math.floor(Date.now() / 1000) - 21600,
      sunset: Math.floor(Date.now() / 1000) + 21600,
    },
    timezone: -18000,
    id: 5128581,
    name: 'Demo City',
    cod: 200,
    _isMock: true,
  };
}
