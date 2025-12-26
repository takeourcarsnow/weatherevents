# WeatherPlanner 🌤️

A beautiful, mobile-friendly weather-based day planner app built with Next.js, TypeScript, and Tailwind CSS. Get personalized activity suggestions based on your local weather conditions and discover events happening near you.

## Features

- 🌦️ **Real-time Weather** - Current conditions, hourly and 5-day forecasts
- 🎯 **Smart Activity Suggestions** - Personalized recommendations based on weather
- 📅 **Local Events** - Discover events happening near you
- 🌍 **Location-based** - Automatic location detection or manual city search
- 🌙 **Dark Mode** - Light/dark/system theme support
- 📱 **Mobile-first** - iOS-like smooth UI/UX design
- ⚡ **Fast** - Built with Next.js App Router for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weatherevents.git
cd weatherevents
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your OpenWeatherMap API key to `.env.local`:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

Get a free API key at [OpenWeatherMap](https://openweathermap.org/api)

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Mode

The app includes a demo mode that works without an API key. If the API fails or no key is provided, you can click "Use Demo Mode" to explore the app with sample data.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── views/             # Page view components
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Context providers
├── components/
│   ├── features/          # Feature components
│   │   ├── WeatherDisplay.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── EventCard.tsx
│   │   └── ...
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   └── Container.tsx
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── ...
├── contexts/              # React Context providers
│   ├── ThemeContext.tsx
│   └── AppContext.tsx
├── hooks/                 # Custom React hooks
│   ├── useLocation.ts
│   ├── useActivities.ts
│   └── useEvents.ts
├── services/              # API services
│   ├── weatherService.ts
│   ├── locationService.ts
│   └── eventsService.ts
├── types/                 # TypeScript types
│   ├── weather.ts
│   ├── activity.ts
│   └── event.ts
├── utils/                 # Utility functions
│   ├── weather.ts
│   ├── date.ts
│   └── format.ts
└── constants/             # App constants
    ├── weather.ts
    ├── activities.ts
    └── config.ts
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Weather API**: OpenWeatherMap
- **Deployment**: Ready for Vercel

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Supabase Integration (Optional)

The app is prepared for Supabase integration for:
- User authentication
- Saved locations
- Event bookmarks
- User preferences

Add these to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Configuration

### Weather Units

The default unit is Celsius (metric). To change to Fahrenheit, update `API_CONFIG` in `src/constants/config.ts`.

### Adding Activities

Add new activities in `src/constants/activities.ts`. Each activity includes:
- Weather conditions it's suitable for
- Indoor/outdoor classification
- Category, duration, and price range

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Weather data by [OpenWeatherMap](https://openweathermap.org/)
- Icons and emojis for visual elements
- Inspired by iOS design patterns
