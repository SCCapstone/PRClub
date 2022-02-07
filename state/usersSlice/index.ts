import { createSlice, Dictionary, PayloadAction } from '@reduxjs/toolkit';
import User from '../../types/shared/User';
import { initialState } from './state';
import { queryUsersByEmail } from './thunks';

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(queryUsersByEmail.pending, (state) => {
      state.status = 'fetching';
    });

    builder.addCase(queryUsersByEmail.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.ids = action.payload.map((u) => u.id);

      const entities: Dictionary<User> = {};
      action.payload.forEach((u) => {
        entities[u.id] = u;
      });
      state.entities = entities;

      state.status = 'loaded';
    });
  },
});

export default usersSlice.reducer;
