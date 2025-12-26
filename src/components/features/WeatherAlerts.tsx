'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeatherAlert } from '@/types/settings';
import { Card, Button } from '@/components/ui';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  onDismiss?: (id: string) => void;
  className?: string;
}

export function WeatherAlerts({ alerts, onDismiss, className = '' }: WeatherAlertsProps) {
  if (alerts.length === 0) return null;

  const getAlertColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'extreme':
        return {
          bg: 'bg-red-50 dark:bg-red-900/30',
          border: 'border-red-500',
          icon: '🚨',
          text: 'text-red-800 dark:text-red-200',
        };
      case 'severe':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/30',
          border: 'border-orange-500',
          icon: '⚠️',
          text: 'text-orange-800 dark:text-orange-200',
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/30',
          border: 'border-yellow-500',
          icon: '⚡',
          text: 'text-yellow-800 dark:text-yellow-200',
        };
      case 'minor':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          border: 'border-blue-500',
          icon: 'ℹ️',
          text: 'text-blue-800 dark:text-blue-200',
        };
    }
  };

  const getAlertTypeLabel = (type: WeatherAlert['type']) => {
    switch (type) {
      case 'severe':
        return 'Severe Weather';
      case 'warning':
        return 'Warning';
      case 'watch':
        return 'Watch';
      case 'advisory':
        return 'Advisory';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => {
          const colors = getAlertColor(alert.severity);
          return (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`p-4 rounded-2xl ${colors.bg} border-l-4 ${colors.border}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{colors.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full bg-white/50 dark:bg-gray-800/50 ${colors.text} font-medium`}
                    >
                      {getAlertTypeLabel(alert.type)}
                    </span>
                  </div>
                  <h4 className={`font-semibold ${colors.text} mb-1`}>{alert.title}</h4>
                  <p className={`text-sm ${colors.text} opacity-80`}>{alert.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Until {new Date(alert.endTime).toLocaleString()}
                  </p>
                </div>
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Dismiss alert"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Demo alerts for testing
export function getMockWeatherAlerts(): WeatherAlert[] {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return [
    {
      id: '1',
      type: 'warning',
      title: 'Heat Advisory',
      description:
        'High temperatures expected. Stay hydrated and avoid prolonged outdoor activities during peak hours.',
      startTime: now.toISOString(),
      endTime: tomorrow.toISOString(),
      severity: 'moderate',
    },
  ];
}
