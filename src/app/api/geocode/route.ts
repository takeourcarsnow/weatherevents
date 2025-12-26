import { NextRequest, NextResponse } from 'next/server';

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/geo/1.0';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const limit = searchParams.get('limit') || '5';

  if (!WEATHER_API_KEY) {
    return NextResponse.json(getMockGeocodeResponse(query));
  }

  try {
    let url: URL;

    if (query) {
      // Forward geocoding (city name to coordinates)
      url = new URL(`${BASE_URL}/direct`);
      url.searchParams.append('q', query);
      url.searchParams.append('limit', limit);
    } else if (lat && lon) {
      // Reverse geocoding (coordinates to city name)
      url = new URL(`${BASE_URL}/reverse`);
      url.searchParams.append('lat', lat);
      url.searchParams.append('lon', lon);
      url.searchParams.append('limit', '1');
    } else {
      return NextResponse.json(
        { error: 'Missing query or coordinates' },
        { status: 400 }
      );
    }

    url.searchParams.append('appid', WEATHER_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json(getMockGeocodeResponse(query));
  }
}

function getMockGeocodeResponse(query: string | null) {
  if (!query) {
    return [
      {
        name: 'Demo City',
        lat: 40.7128,
        lon: -74.006,
        country: 'US',
        state: 'New York',
      },
    ];
  }

  return [
    {
      name: query,
      lat: 40.7128,
      lon: -74.006,
      country: 'US',
      state: 'Demo State',
    },
  ];
}
