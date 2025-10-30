// Application-wide configuration
export const APP_CONFIG = {
 // Form types and their display names
  FORM_TYPES: {
    icp: 'ICP Development',
    valueMap: 'Value Mapping',
    contentExpander: 'Message Multiplier™',
    funnel: 'Funnel Builder',
    landing: 'Landing Page',
    offer: 'Offer Prompt'
  } as const,

  // Storage keys
  STORAGE_KEYS: {
    SUBMISSIONS: 'form_submissions',
    RESULTS: 'form_results',
    FORM_DATA_PREFIX: 'form_data_',
    FORM_HISTORY: 'form_history'
  } as const,

  // API endpoints
  API_ENDPOINTS: {
    GENERATE: '/api/generate',
    SUBMISSIONS: '/api/submissions',
    RESULTS: (id: string) => `/api/results/${id}`,
    AUTH: {
      CALLBACK: '/api/callback',
      REGISTER: '/api/register',
      NEXT_AUTH: '/api/auth/[...nextauth]'
    }
  } as const,

  // Validation rules
  VALIDATION: {
    MIN_ARRAY_LENGTH: 1,
    MAX_ARRAY_LENGTH: 10,
    MIN_STRING_LENGTH: 1,
    MAX_STRING_LENGTH: 500
  } as const,

  // UI constants
  UI: {
    DEBOUNCE_TIME: 300,
    AUTO_SAVE_DELAY: 3000,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf']
  } as const,

  // Error messages
  ERROR_MESSAGES: {
    FORM_SUBMISSION: 'There was an error submitting your form. Please try again.',
    DATA_FETCH: 'Failed to fetch data. Please refresh the page.',
    VALIDATION: 'Please fix the errors in the form before submitting.',
    AUTH_REQUIRED: 'You must be logged in to access this feature.'
  } as const
};

// Type definitions based on config
export type FormKind = keyof typeof APP_CONFIG.FORM_TYPES;
export type StorageKey = keyof typeof APP_CONFIG.STORAGE_KEYS;
export type ApiEndpoint = keyof typeof APP_CONFIG.API_ENDPOINTS;
