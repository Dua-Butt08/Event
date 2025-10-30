import { configureStore } from '@reduxjs/toolkit';
import { submissionsApi } from './api/submissionsApi';
import offerPromptReducer from './slices/offerPromptSlice';

/**
 * Configure Redux store with RTK Query
 * - Includes Redux DevTools for development
 * - Automatic caching and request deduplication via RTK Query
 * - Optimized middleware for production performance
 */
export const store = configureStore({
  reducer: {
    // RTK Query API reducer - handles all data fetching and caching
    [submissionsApi.reducerPath]: submissionsApi.reducer,
    offerPrompt: offerPromptReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serialization checks in production for performance
      serializableCheck: process.env.NODE_ENV === 'development',
      // Disable immutability checks in production for performance
      immutableCheck: process.env.NODE_ENV === 'development',
    })
    // Add RTK Query middleware for caching and request lifecycle
    .concat(submissionsApi.middleware),
  devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;