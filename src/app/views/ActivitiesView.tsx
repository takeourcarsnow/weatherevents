'use client';

import React from 'react';
import { useActivities } from '@/hooks';
import { ActivityList } from '@/components/features';
import { PageContainer, Section } from '@/components/layout';

export function ActivitiesView() {
  const { suggestions, isOutdoorWeather } = useActivities();

  return (
    <PageContainer>
      <Section
        title="Activities for Today"
        subtitle="Based on current weather conditions"
      >
        <ActivityList
          suggestions={suggestions}
          isOutdoorWeather={isOutdoorWeather}
        />
      </Section>
    </PageContainer>
  );
}
