'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: string }>;
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline' | 'segmented';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className,
}: TabsProps) {
  const baseContainer = 'flex gap-1';
  const baseTab = `
    flex items-center gap-2 font-medium
    transition-all duration-200
    focus:outline-none
  `;

  const variants = {
    pills: {
      container: 'p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl',
      tab: 'px-4 py-2 rounded-xl text-sm',
      active: 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
    },
    underline: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'px-4 py-3 text-sm border-b-2 -mb-px',
      active: 'border-blue-500 text-blue-600 dark:text-blue-400',
      inactive: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300',
    },
    segmented: {
      container: 'p-1 bg-gray-100 dark:bg-gray-800 rounded-full',
      tab: 'px-5 py-2.5 rounded-full text-sm',
      active: 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
    },
  };

  const styles = variants[variant];

  return (
    <div className={cn(baseContainer, styles.container, className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            baseTab,
            styles.tab,
            activeTab === tab.id ? styles.active : styles.inactive
          )}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Scrollable tabs for many items
interface ScrollableTabsProps extends Omit<TabsProps, 'variant'> {
  scrollable?: boolean;
}

export function ScrollableTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: ScrollableTabsProps) {
  return (
    <div className={cn('overflow-x-auto scrollbar-hide -mx-4 px-4', className)}>
      <div className="flex gap-2 pb-2 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              `flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
              transition-all duration-200 whitespace-nowrap
              focus:outline-none active:scale-95`,
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {tab.icon && <span className="text-lg">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
