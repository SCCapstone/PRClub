import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import PR from '../../types/shared/PR';
import { initialState, prsAdapter } from './state';
import {
  fetchPRsForUser, upsertPR,
} from './thunks';

const prsSlice = createSlice({
  name: 'prs',
  initialState,
  reducers: {
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
      .addCase(upsertPR.fulfilled, (state, action: PayloadAction<PR>) => {
        prsAdapter.upsertOne(state, action.payload);
        state.status = 'loaded';
      })
      .addCase(upsertPR.fulfilled, (state, action: PayloadAction<PR>) => {
        prsAdapter.removeOne(state, action.payload.id);
        state.status = 'loaded';
      });
  },
});

export const {
  flushPRsFromStore,
} = prsSlice.actions;

export default prsSlice.reducer;
