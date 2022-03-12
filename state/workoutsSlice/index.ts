import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { removeWorkout, upsertWorkout } from './thunks';

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    clearUpsertWorkoutResult(state) {
      state.upsertWorkoutResult = null;
    },
    clearRemoveWorkoutResult(state) {
      state.removeWorkoutResult = null;
    },

  },
  extraReducers(builder) {
    builder
      .addCase(upsertWorkout.pending, (state) => {
        state.callingService = true;
      })
      .addCase(upsertWorkout.fulfilled, (state) => {
        state.upsertWorkoutResult = { success: true };
        state.callingService = false;
      })
      .addCase(upsertWorkout.rejected, (state, action) => {
        state.upsertWorkoutResult = { success: false, error: action.error };
        state.callingService = false;
      });

    builder
      .addCase(removeWorkout.pending, (state) => {
        state.callingService = true;
      })
      .addCase(removeWorkout.fulfilled, (state) => {
        state.removeWorkoutResult = { success: true };
        state.callingService = false;
      })
      .addCase(removeWorkout.rejected, (state, action) => {
        state.removeWorkoutResult = { success: false, error: action.error };
        state.callingService = false;
      });
  },
});

export const {
  clearRemoveWorkoutResult,
  clearUpsertWorkoutResult,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
