# Weather Events Day Planner - Copilot Instructions

## Project Overview
A Next.js TypeScript weather-based day planner app that suggests activities based on current weather conditions and finds local events.

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Context for state management
- Prepared for Vercel deployment and Supabase integration

## Project Structure
```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── features/    # Feature-specific components
│   └── layout/      # Layout components
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── services/        # API and business logic services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── constants/       # App constants and configurations
```

## Development Guidelines
- Use functional components with TypeScript
- Split code into small, logical files
- Mobile-first responsive design
- Support light/dark themes
- iOS-like smooth UI/UX

## API Keys Required
- OpenWeatherMap API key (for weather data)
- Optional: Additional event APIs

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
