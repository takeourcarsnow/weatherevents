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
    return NextResponse.json(getMockForecastResponse());
  }

  try {
    const url = new URL(`${BASE_URL}/forecast`);
    url.searchParams.append('lat', lat);
    url.searchParams.append('lon', lon);
    url.searchParams.append('units', units);
    url.searchParams.append('appid', WEATHER_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Forecast API error:', error);
    return NextResponse.json(getMockForecastResponse());
  }
}

function getMockForecastResponse() {
  const now = Math.floor(Date.now() / 1000);
  const conditions = ['Clear', 'Clouds', 'Rain'];
  const icons = ['01d', '02d', '10d'];

  return {
    list: Array.from({ length: 40 }, (_, i) => {
      const condIndex = Math.floor(Math.random() * 3);
      return {
        dt: now + i * 3600 * 3,
        main: {
          temp: 18 + Math.round(Math.random() * 12),
          feels_like: 19 + Math.round(Math.random() * 10),
          temp_min: 16 + Math.round(Math.random() * 8),
          temp_max: 22 + Math.round(Math.random() * 8),
          pressure: 1010 + Math.round(Math.random() * 20),
          humidity: 40 + Math.round(Math.random() * 40),
        },
        weather: [
          {
            id: 800 + condIndex * 100,
            main: conditions[condIndex],
            description: conditions[condIndex].toLowerCase(),
            icon: icons[condIndex],
          },
        ],
        wind: { speed: 2 + Math.random() * 8 },
        pop: Math.random() * 0.5,
      };
    }),
    city: {
      name: 'Demo City',
      country: 'US',
      timezone: -18000,
    },
    _isMock: true,
  };
}
