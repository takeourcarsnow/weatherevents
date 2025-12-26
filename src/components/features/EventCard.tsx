'use client';

import React from 'react';
import { Event } from '@/types';
import { Card, Badge } from '@/components/ui';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const startDate = new Date(event.startTime);
  const timeString = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const dateString = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card
      variant="default"
      padding="none"
      hover={!!onClick}
      onClick={onClick}
      className="overflow-hidden h-full flex flex-col"
    >
      {/* Image */}
      {event.imageUrl && (
        <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          {event.isFree && (
            <Badge variant="success" className="absolute top-3 left-3">
              Free
            </Badge>
          )}
          <div className="absolute bottom-3 right-3">
            <Badge variant="default" className="bg-black/60 text-white border-0">
              {getCategoryIcon(event.category)} {event.category}
            </Badge>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
          {event.name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
          {event.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{dateString} • {timeString}</span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.venue.name}</span>
        </div>

        {/* Price */}
        {event.price && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {event.price}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    music: '🎵',
    arts: '🎨',
    sports: '⚽',
    food: '🍽️',
    community: '👥',
    education: '📚',
    family: '👨‍👩‍👧',
    nightlife: '🌙',
    film: '🎬',
    theater: '🎭',
    outdoor: '🌳',
    wellness: '🧘',
    business: '💼',
    other: '✨',
  };
  return icons[category] || '✨';
}

// Compact version for horizontal scrolling
export function EventCardCompact({ event, onClick }: EventCardProps) {
  const startDate = new Date(event.startTime);
  const timeString = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <button
      onClick={onClick}
      className="w-64 flex-shrink-0 text-left rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {event.imageUrl && (
        <div className="h-28 bg-gray-100 dark:bg-gray-800">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <h4 className="font-medium text-gray-900 dark:text-white truncate">
          {event.name}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {timeString} • {event.venue.name}
        </p>
        {event.isFree && (
          <Badge variant="success" size="sm" className="mt-2">
            Free
          </Badge>
        )}
      </div>
    </button>
  );
}
