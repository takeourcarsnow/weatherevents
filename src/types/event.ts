// Event-related types
export interface Event {
  id: string;
  name: string;
  description: string;
  venue: EventVenue;
  startTime: string;
  endTime?: string;
  category: EventCategory;
  imageUrl?: string;
  ticketUrl?: string;
  price?: string;
  isFree: boolean;
  isVirtual: boolean;
  tags: string[];
}

export interface EventVenue {
  name: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // in km
}

export type EventCategory = 
  | 'music'
  | 'arts'
  | 'sports'
  | 'food'
  | 'community'
  | 'education'
  | 'family'
  | 'nightlife'
  | 'film'
  | 'theater'
  | 'outdoor'
  | 'wellness'
  | 'business'
  | 'other';

export interface EventFilters {
  category?: EventCategory;
  date?: Date;
  radius?: number; // in km
  isFree?: boolean;
  isIndoor?: boolean;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  hasMore: boolean;
}
