// Events service - mock implementation for local events
import { Event, EventsResponse, EventFilters, EventCategory, Coordinates } from '@/types';
import { generateId } from '@/utils';

// Mock events data for demonstration
const MOCK_EVENTS: Event[] = [
  {
    id: generateId(),
    name: 'Jazz Night at Blue Note',
    description: 'Enjoy live jazz performances from local and international artists in an intimate setting.',
    venue: {
      name: 'Blue Note Jazz Club',
      address: '131 W 3rd St',
      city: 'New York',
      latitude: 40.7306,
      longitude: -74.0001,
    },
    startTime: new Date(Date.now() + 3600000 * 4).toISOString(),
    endTime: new Date(Date.now() + 3600000 * 7).toISOString(),
    category: 'music',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400',
    price: '$25-45',
    isFree: false,
    isVirtual: false,
    tags: ['jazz', 'live music', 'nightlife'],
  },
  {
    id: generateId(),
    name: 'Modern Art Exhibition',
    description: 'Explore contemporary artworks from emerging artists around the world.',
    venue: {
      name: 'City Art Gallery',
      address: '450 Park Ave',
      city: 'New York',
      latitude: 40.7614,
      longitude: -73.9776,
    },
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 3600000 * 8).toISOString(),
    category: 'arts',
    imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400',
    isFree: true,
    isVirtual: false,
    tags: ['art', 'exhibition', 'contemporary'],
  },
  {
    id: generateId(),
    name: 'Food Truck Festival',
    description: 'Sample delicious cuisines from over 30 food trucks featuring international flavors.',
    venue: {
      name: 'Central Park South',
      address: 'Central Park',
      city: 'New York',
      latitude: 40.7649,
      longitude: -73.9731,
    },
    startTime: new Date(Date.now() + 3600000 * 2).toISOString(),
    endTime: new Date(Date.now() + 3600000 * 10).toISOString(),
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=400',
    price: '$5-15 per item',
    isFree: false,
    isVirtual: false,
    tags: ['food', 'festival', 'outdoor'],
  },
  {
    id: generateId(),
    name: 'Community Yoga in the Park',
    description: 'Join our free outdoor yoga session suitable for all skill levels.',
    venue: {
      name: 'Riverside Park',
      address: 'Riverside Dr',
      city: 'New York',
      latitude: 40.8010,
      longitude: -73.9702,
    },
    startTime: new Date(Date.now() + 3600000 * 24).toISOString(),
    category: 'wellness',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    isFree: true,
    isVirtual: false,
    tags: ['yoga', 'fitness', 'free', 'outdoor'],
  },
  {
    id: generateId(),
    name: 'Indie Film Screening',
    description: 'Watch award-winning independent films followed by Q&A with directors.',
    venue: {
      name: 'Angelika Film Center',
      address: '18 W Houston St',
      city: 'New York',
      latitude: 40.7265,
      longitude: -73.9959,
    },
    startTime: new Date(Date.now() + 3600000 * 5).toISOString(),
    endTime: new Date(Date.now() + 3600000 * 8).toISOString(),
    category: 'film',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    price: '$15',
    isFree: false,
    isVirtual: false,
    tags: ['film', 'indie', 'cinema'],
  },
  {
    id: generateId(),
    name: 'Science Museum Open Day',
    description: 'Free entry to all exhibitions plus special interactive demonstrations.',
    venue: {
      name: 'Natural History Museum',
      address: '79th St',
      city: 'New York',
      latitude: 40.7813,
      longitude: -73.9740,
    },
    startTime: new Date(Date.now() + 3600000 * 3).toISOString(),
    endTime: new Date(Date.now() + 3600000 * 11).toISOString(),
    category: 'education',
    imageUrl: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=400',
    isFree: true,
    isVirtual: false,
    tags: ['science', 'museum', 'family', 'education'],
  },
  {
    id: generateId(),
    name: 'Local Basketball Tournament',
    description: '3v3 basketball tournament open to all skill levels with prizes.',
    venue: {
      name: 'West 4th Street Courts',
      address: 'W 4th St & 6th Ave',
      city: 'New York',
      latitude: 40.7308,
      longitude: -74.0007,
    },
    startTime: new Date(Date.now() + 3600000 * 6).toISOString(),
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    isFree: true,
    isVirtual: false,
    tags: ['sports', 'basketball', 'tournament', 'outdoor'],
  },
  {
    id: generateId(),
    name: 'Broadway Musical Workshop',
    description: 'Learn songs and choreography from hit Broadway musicals.',
    venue: {
      name: 'Theater District Studio',
      address: '234 W 42nd St',
      city: 'New York',
      latitude: 40.7566,
      longitude: -73.9889,
    },
    startTime: new Date(Date.now() + 3600000 * 48).toISOString(),
    endTime: new Date(Date.now() + 3600000 * 51).toISOString(),
    category: 'theater',
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400',
    price: '$50',
    isFree: false,
    isVirtual: false,
    tags: ['theater', 'workshop', 'broadway', 'dance'],
  },
  {
    id: generateId(),
    name: 'Farmers Market Weekend',
    description: 'Fresh local produce, artisan goods, and live acoustic music.',
    venue: {
      name: 'Union Square',
      address: 'Union Square',
      city: 'New York',
      latitude: 40.7359,
      longitude: -73.9911,
    },
    startTime: new Date(Date.now() + 3600000 * 8).toISOString(),
    endTime: new Date(Date.now() + 3600000 * 14).toISOString(),
    category: 'community',
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
    isFree: true,
    isVirtual: false,
    tags: ['market', 'food', 'local', 'outdoor'],
  },
  {
    id: generateId(),
    name: 'Tech Startup Meetup',
    description: 'Network with entrepreneurs and hear pitches from innovative startups.',
    venue: {
      name: 'WeWork Soho',
      address: '115 Broadway',
      city: 'New York',
      latitude: 40.7081,
      longitude: -74.0103,
    },
    startTime: new Date(Date.now() + 3600000 * 28).toISOString(),
    endTime: new Date(Date.now() + 3600000 * 31).toISOString(),
    category: 'business',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
    isFree: true,
    isVirtual: false,
    tags: ['tech', 'networking', 'startups', 'business'],
  },
  {
    id: generateId(),
    name: 'Kids Adventure Day',
    description: 'Fun activities, games, and crafts for children ages 5-12.',
    venue: {
      name: 'Brooklyn Children\'s Museum',
      address: '145 Brooklyn Ave',
      city: 'Brooklyn',
      latitude: 40.6743,
      longitude: -73.9439,
    },
    startTime: new Date(Date.now() + 3600000 * 10).toISOString(),
    endTime: new Date(Date.now() + 3600000 * 16).toISOString(),
    category: 'family',
    imageUrl: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=400',
    price: '$12',
    isFree: false,
    isVirtual: false,
    tags: ['kids', 'family', 'activities', 'museum'],
  },
  {
    id: generateId(),
    name: 'Rooftop DJ Night',
    description: 'Dance under the stars with top DJs spinning house and techno.',
    venue: {
      name: 'Skybar Rooftop',
      address: '230 5th Ave',
      city: 'New York',
      latitude: 40.7440,
      longitude: -73.9877,
    },
    startTime: new Date(Date.now() + 3600000 * 30).toISOString(),
    category: 'nightlife',
    imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=400',
    price: '$20',
    isFree: false,
    isVirtual: false,
    tags: ['nightlife', 'dj', 'dance', 'rooftop'],
  },
];

export async function fetchEvents(
  coords: Coordinates,
  filters?: EventFilters
): Promise<EventsResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredEvents = [...MOCK_EVENTS];

  // Apply filters
  if (filters?.category) {
    filteredEvents = filteredEvents.filter((e) => e.category === filters.category);
  }

  if (filters?.isFree !== undefined) {
    filteredEvents = filteredEvents.filter((e) => e.isFree === filters.isFree);
  }

  if (filters?.isIndoor !== undefined) {
    filteredEvents = filteredEvents.filter((e) => {
      const isOutdoor = e.tags.includes('outdoor');
      return filters.isIndoor ? !isOutdoor : isOutdoor;
    });
  }

  // Sort by start time
  filteredEvents.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return {
    events: filteredEvents,
    total: filteredEvents.length,
    page: 1,
    hasMore: false,
  };
}

export async function fetchEventById(eventId: string): Promise<Event | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_EVENTS.find((e) => e.id === eventId) || null;
}

export async function searchEvents(
  query: string,
  coords: Coordinates
): Promise<Event[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const lowerQuery = query.toLowerCase();
  return MOCK_EVENTS.filter(
    (e) =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.description.toLowerCase().includes(lowerQuery) ||
      e.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}

export function getEventCategories(): { id: EventCategory; label: string; icon: string }[] {
  return [
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'arts', label: 'Arts', icon: '🎨' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'community', label: 'Community', icon: '👥' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
    { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
    { id: 'film', label: 'Film', icon: '🎬' },
    { id: 'theater', label: 'Theater', icon: '🎭' },
    { id: 'outdoor', label: 'Outdoor', icon: '🌳' },
    { id: 'wellness', label: 'Wellness', icon: '🧘' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'other', label: 'Other', icon: '✨' },
  ];
}

export function getIndoorEvents(): Event[] {
  return MOCK_EVENTS.filter((e) => !e.tags.includes('outdoor'));
}

export function getOutdoorEvents(): Event[] {
  return MOCK_EVENTS.filter((e) => e.tags.includes('outdoor'));
}

export function getFreeEvents(): Event[] {
  return MOCK_EVENTS.filter((e) => e.isFree);
}
