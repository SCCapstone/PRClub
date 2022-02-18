import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../types/shared/User';
import { initialState, usersAdapter } from './state';
import { getUsersByIds, getUsersByQuery } from './thunks';

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUsersByQuery.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(getUsersByQuery.fulfilled, (state, action: PayloadAction<User[]>) => {
        usersAdapter.removeAll(state);
        usersAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      })
      .addCase(getUsersByIds.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(getUsersByIds.fulfilled, (state, action: PayloadAction<User[]>) => {
        usersAdapter.removeAll(state);
        usersAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      });
  },
});

export default usersSlice.reducer;
