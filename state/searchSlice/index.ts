import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../models/firestore/User';
import { initialState, searchAdapter } from './state';
import { queryUsers } from './thunks';

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    flushSearch: searchAdapter.removeAll,
  },
  extraReducers(builder) {
    builder
      .addCase(queryUsers.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(queryUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        searchAdapter.removeAll(state);
        searchAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      });
  },
});

export const {
  flushSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
