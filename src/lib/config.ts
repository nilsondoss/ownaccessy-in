/**
 * Application configuration
 * Handles environment-specific URLs and settings
 */

// Get the public URL based on environment
export const getPublicUrl = (): string => {
  // Production domain
  if (import.meta.env.VITE_PUBLIC_URL) {
    return import.meta.env.VITE_PUBLIC_URL;
  }

  // Browser environment - use current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Fallback for SSR/build time
  return 'https://ownaccessy.in';
};

// Get the API URL
export const getApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return `${getPublicUrl()}/api`;
};

// Application metadata
export const APP_CONFIG = {
  name: 'ownaccessy',
  domain: 'ownaccessy.in',
  publicUrl: getPublicUrl(),
  apiUrl: getApiUrl(),
  supportEmail: 'support@ownaccessy.in',
  companyName: 'ownaccessy',
} as const;

// Export individual values for convenience
export const PUBLIC_URL = APP_CONFIG.publicUrl;
export const API_URL = APP_CONFIG.apiUrl;
export const APP_NAME = APP_CONFIG.name;
export const SUPPORT_EMAIL = APP_CONFIG.supportEmail;
