'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav, defaultNavItems } from '@/components/layout/BottomNav';
import { HomeView, ActivitiesView, EventsView, SettingsView } from './views';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      case 'activities':
        return <ActivitiesView />;
      case 'events':
        return <EventsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      {renderView()}
      <BottomNav
        items={defaultNavItems}
        activeItem={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
}
