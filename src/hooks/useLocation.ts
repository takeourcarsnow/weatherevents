'use client';

import { useState, useEffect, useCallback } from 'react';
import { Coordinates, LocationPermissionStatus } from '@/types';
import { getCurrentPosition, checkLocationPermission, getDefaultLocation } from '@/services';

interface UseLocationReturn {
  coordinates: Coordinates | null;
  permissionStatus: LocationPermissionStatus;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
}

export function useLocation(): UseLocationReturn {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>('prompt');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkPermission = useCallback(async () => {
    const status = await checkLocationPermission();
    setPermissionStatus(status);
    return status;
  }, []);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const coords = await getCurrentPosition();
      setCoordinates(coords);
      setPermissionStatus('granted');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      
      if (errorMessage.includes('denied')) {
        setPermissionStatus('denied');
      }
      
      // Fall back to default location
      setCoordinates(getDefaultLocation());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const status = await checkPermission();
      
      if (status === 'granted') {
        await requestLocation();
      } else if (status === 'prompt') {
        // Request location on mount
        await requestLocation();
      } else {
        // Use default location
        setCoordinates(getDefaultLocation());
        setIsLoading(false);
      }
    };

    init();
  }, [checkPermission, requestLocation]);

  return {
    coordinates,
    permissionStatus,
    isLoading,
    error,
    requestLocation,
  };
}
