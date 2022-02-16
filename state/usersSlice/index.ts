import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../types/shared/User';
import { initialState, usersAdapter } from './state';
import { queryUsersByEmail } from './thunks';

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(queryUsersByEmail.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(queryUsersByEmail.fulfilled, (state, action: PayloadAction<User[]>) => {
        usersAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      });
  },
});

export default usersSlice.reducer;
