import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OfferPromptState {
  latest: {
    id: string;
    status: 'completed' | 'failed';
    payload?: Record<string, unknown>;
    message?: string;
    timestamp?: string;
  } | null;
}

const initialState: OfferPromptState = {
  latest: null,
};

export const offerPromptSlice = createSlice({
  name: 'offerPrompt',
  initialState,
  reducers: {
    setOfferPromptResult: (
      state,
      action: PayloadAction<{
        id: string;
        status: 'completed' | 'failed';
        payload?: Record<string, unknown>;
        message?: string;
        timestamp?: string;
      }>
    ) => {
      state.latest = action.payload;
    },
    clearOfferPromptResult: (state) => {
      state.latest = null;
    },
  },
});

export const { setOfferPromptResult, clearOfferPromptResult } = offerPromptSlice.actions;
export default offerPromptSlice.reducer;
