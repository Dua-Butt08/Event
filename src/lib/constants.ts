// Application-wide constants

// Form step configurations
export const FORM_STEPS = {
  icp: [
    {
      title: 'Business Overview',
      description: 'Define your business and offering',
      fields: ['businessName', 'offerDescription', 'priceRange', 'promise']
    },
    {
      title: 'Target Audience',
      description: 'Describe your ideal customer',
      fields: ['personaName', 'audienceIndustry', 'audienceRole', 'ageRange', 'location', 'incomeOrCompanySize']
    },
    {
      title: 'Problems & Pain Points',
      description: 'Identify core problems and impacts',
      fields: ['coreProblem', 'problemImpact', 'problemWhyPersisted', 'triedBefore']
    },
    {
      title: 'Emotional Drivers',
      description: 'Understand emotional motivations',
      fields: ['emotions', 'fearsPrivate', 'dreamSolution', 'refuseToDo', 'externalBlame', 'hiddenComfortOfProblem']
    },
    {
      title: 'Relationships & Outcomes',
      description: 'Map relationships and success outcomes',
      fields: ['relationshipsAffected', 'hurtfulComments', 'successReactions', 'marketBeliefs', 'psychologicalBarriers', 'idealLifeAfter']
    }
  ],
  valueMap: [
    {
      title: 'Current & Desired State',
      description: 'Define your starting point and goals',
      fields: ['currentState', 'desiredState']
    },
    {
      title: 'Milestones',
      description: 'Break down your transformation into steps',
      fields: ['milestones']
    },
    {
      title: 'Strategy',
      description: 'Plan your content approach',
      fields: ['transformationSummary', 'contentStrategy']
    }
  ],
  contentExpander: [
    {
      title: 'Content Items',
      description: 'Select milestones and subtopics to expand',
      fields: ['items']
    }
  ],
  funnel: [
    {
      title: 'Event Overview',
      description: 'Basic event information',
      fields: ['eventName', 'targetAudience', 'eventDates', 'eventLocation']
    },
    {
      title: 'Content & Speakers',
      description: 'Define themes and speakers',
      fields: ['themes', 'speakers']
    },
    {
      title: 'Ticketing & Social Proof',
      description: 'Set up pricing and testimonials',
      fields: ['ticketTiers', 'testimonials']
    },
    {
      title: 'Strategy',
      description: 'Configure lead capture and urgency',
      fields: ['leadCaptureStrategy', 'urgency']
    }
  ],
  landing: [
    {
      title: 'Hero Section',
      description: 'Main headline and call-to-action',
      fields: ['hero']
    },
    {
      title: 'Problem & Solution',
      description: 'Define the core problem and solution',
      fields: ['problem', 'solution']
    },
    {
      title: 'Features & Proof',
      description: 'Show features and social proof',
      fields: ['features', 'proof']
    },
    {
      title: 'Call-to-Action & Urgency',
      description: 'Final CTA and urgency elements',
      fields: ['cta', 'urgency', 'objections', 'faq']
    }
  ]
} as const;

// UI Constants
export const UI_CONSTANTS = {
 THEME: {
    COLORS: {
      PRIMARY: 'var(--accent)',
      SECONDARY: 'var(--accent-2)',
      BACKGROUND: 'var(--bg)',
      SURFACE: 'var(--bg-elev)',
      TEXT: 'var(--text)',
      MUTED: 'var(--muted)',
      BORDER: 'var(--border)',
      ERROR: 'var(--error)',
      SUCCESS: 'var(--success)'
    }
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px'
  },
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    XXL: '3rem'
  }
} as const;

// API Response Statuses
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
  IDLE: 'idle'
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  SUBMISSIONS: 'form_submissions',
  RESULTS: 'form_results',
  USER_PREFERENCES: 'user_preferences',
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please fix the errors in the form before submitting.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  TIMEOUT: 'Request timed out. Please try again.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: 'Form submitted successfully!',
  DATA_SAVED: 'Data saved successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Registration successful!'
} as const;

// Form Storage Keys
export const FORM_STORAGE_KEYS = {
 ICP: 'icp_form_data',
  VALUE_MAP: 'value_map_form_data',
  CONTENT_EXPANDER: 'content_expander_form_data',
  FUNNEL: 'funnel_form_data',
  LANDING: 'landing_page_form_data'
} as const;
