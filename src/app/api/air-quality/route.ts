import { NextRequest, NextResponse } from 'next/server';

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing latitude or longitude' },
      { status: 400 }
    );
  }

  if (!WEATHER_API_KEY) {
    return NextResponse.json(getMockAirQualityResponse());
  }

  try {
    const url = new URL(`${BASE_URL}/air_pollution`);
    url.searchParams.append('lat', lat);
    url.searchParams.append('lon', lon);
    url.searchParams.append('appid', WEATHER_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      throw new Error(`Air Quality API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Air Quality API error:', error);
    return NextResponse.json(getMockAirQualityResponse());
  }
}

function getMockAirQualityResponse() {
  return {
    list: [
      {
        main: {
          aqi: 2, // 1-5 scale: Good, Fair, Moderate, Poor, Very Poor
        },
        components: {
          co: 230.31,
          no: 0.19,
          no2: 8.79,
          o3: 68.66,
          so2: 0.64,
          pm2_5: 8.5,
          pm10: 12.46,
          nh3: 0.86,
        },
        dt: Math.floor(Date.now() / 1000),
      },
    ],
    _isMock: true,
  };
}
