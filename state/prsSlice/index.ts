import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { upsertPRs } from './thunks';
/**
 * Creates reducer logic and actions for PRs
 */
const prsSlice = createSlice({
  name: 'prs',
  initialState,
  reducers: {
    clearUpsertPRResult(state) {
      state.upsertPRResult = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(upsertPRs.fulfilled, (state, action) => {
        state.upsertPRResult = { success: true, numberPRsUpserted: action.payload.length };
      })
      .addCase(upsertPRs.rejected, (state, action) => {
        state.upsertPRResult = { success: false, error: action.error };
      });
  },
});

export const {
  clearUpsertPRResult,
} = prsSlice.actions;

export default prsSlice.reducer;
