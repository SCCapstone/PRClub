import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import PR from '../../models/firestore/PR';
import { initialState, prsAdapter } from './state';
import {
  fetchPRsForUser, removePR, removePRs, upsertPRs,
} from './thunks';

const prsSlice = createSlice({
  name: 'prs',
  initialState,
  reducers: {
    clearUpsertPRResult(state) {
      state.upsertPRResult = null;
    },
    flushPRsFromStore: prsAdapter.removeAll,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPRsForUser.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(fetchPRsForUser.fulfilled, (state, action: PayloadAction<PR[]>) => {
        prsAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      })
      .addCase(upsertPRs.fulfilled, (state, action: PayloadAction<PR[]>) => {
        prsAdapter.upsertMany(state, action.payload);
        state.upsertPRResult = { success: true, numberPRsUpserted: action.payload.length };
        state.status = 'loaded';
      })
      .addCase(removePR.fulfilled, (state, action: PayloadAction<PR>) => {
        prsAdapter.removeOne(state, action.payload.id);
        state.status = 'loaded';
      })
      .addCase(removePRs.fulfilled, (state, action: PayloadAction<PR[]>) => {
        prsAdapter.removeMany(state, action.payload.map((p) => p.id));
        state.status = 'loaded';
      });
  },
});

export const {
  clearUpsertPRResult,
  flushPRsFromStore,
} = prsSlice.actions;

export default prsSlice.reducer;
