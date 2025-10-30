import { type ClassValue, clsx } from "clsx";

// Class name utility
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format dates
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Generate unique IDs
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Safe localStorage
export function safeLocalStorage<T>(key: string, value?: T): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    }
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
