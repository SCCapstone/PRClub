import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Workout from '../../types/shared/Workout';
import { initialState, workoutsAdapter } from './state';
import { fetchWorkoutsForUser, removeWorkout, upsertWorkout } from './thunks';

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    flushWorkoutsFromStore: workoutsAdapter.removeAll,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchWorkoutsForUser.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(fetchWorkoutsForUser.fulfilled, (state, action: PayloadAction<Workout[]>) => {
        workoutsAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      })
      .addCase(upsertWorkout.fulfilled, (state, action: PayloadAction<Workout>) => {
        workoutsAdapter.upsertOne(state, action.payload);
        state.status = 'loaded';
      })
      .addCase(removeWorkout.fulfilled, (state, action: PayloadAction<Workout>) => {
        workoutsAdapter.removeOne(state, action.payload.id);
        state.status = 'loaded';
      });
  },
});

export const {
  flushWorkoutsFromStore,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
