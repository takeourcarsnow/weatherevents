// Storage utility functions (localStorage wrapper)
import { STORAGE_KEYS } from '@/constants';

export function getStorageItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return null;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
  }
}

export function clearAllStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
}

// Theme-specific storage
export function getStoredTheme(): 'light' | 'dark' | 'system' | null {
  return getStorageItem(STORAGE_KEYS.theme);
}

export function setStoredTheme(theme: 'light' | 'dark' | 'system'): void {
  setStorageItem(STORAGE_KEYS.theme, theme);
}

// Location-specific storage
export interface StoredLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export function getStoredLocation(): StoredLocation | null {
  return getStorageItem(STORAGE_KEYS.location);
}

export function setStoredLocation(location: StoredLocation): void {
  setStorageItem(STORAGE_KEYS.location, location);
}
