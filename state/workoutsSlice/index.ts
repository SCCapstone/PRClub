import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Workout from '../../models/firestore/Workout';
import { initialState, workoutsAdapter } from './state';
import { fetchWorkoutsForUser, removeWorkout, upsertWorkout } from './thunks';

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    flushWorkoutsFromStore: workoutsAdapter.removeAll,
    clearUpsertWorkoutResult(state) {
      state.upsertWorkoutResult = null;
    },
    clearRemoveWorkoutResult(state) {
      state.removeWorkoutResult = null;
    },

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
      .addCase(upsertWorkout.pending, (state) => {
        state.status = 'callingService';
      })
      .addCase(upsertWorkout.fulfilled, (state, action: PayloadAction<Workout>) => {
        workoutsAdapter.upsertOne(state, action.payload);
        state.upsertWorkoutResult = { success: true };
        state.status = 'loaded';
      })
      .addCase(upsertWorkout.rejected, (state, action) => {
        state.upsertWorkoutResult = { success: false, error: action.error };
        state.status = 'loaded';
      })
      .addCase(removeWorkout.pending, (state) => {
        state.status = 'callingService';
      })
      .addCase(removeWorkout.fulfilled, (state, action: PayloadAction<Workout>) => {
        workoutsAdapter.removeOne(state, action.payload.id);
        state.removeWorkoutResult = { success: true };
        state.status = 'loaded';
      })
      .addCase(removeWorkout.rejected, (state, action) => {
        state.removeWorkoutResult = { success: false, error: action.error };
        state.status = 'loaded';
      });
  },
});

export const {
  flushWorkoutsFromStore,
  clearRemoveWorkoutResult,
  clearUpsertWorkoutResult,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
