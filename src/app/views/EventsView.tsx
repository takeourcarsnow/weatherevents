'use client';

import React from 'react';
import { useApp } from '@/contexts';
import { useActivities } from '@/hooks';
import { EventList } from '@/components/features';
import { PageContainer, Section } from '@/components/layout';

export function EventsView() {
  const { location } = useApp();
  const { isOutdoorWeather } = useActivities();

  return (
    <PageContainer>
      <Section
        title="Local Events"
        subtitle="Discover what's happening near you"
      >
        <EventList
          coordinates={location.coordinates}
          isOutdoorWeather={isOutdoorWeather}
        />
      </Section>
    </PageContainer>
  );
}
