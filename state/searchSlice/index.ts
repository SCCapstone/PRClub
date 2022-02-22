import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../types/shared/User';
import { initialState, searchAdapter } from './state';
import { queryUsers } from './thunks';

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
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

export default searchSlice.reducer;
