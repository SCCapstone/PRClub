/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Workout from '../../models/Workout';
import { RootState } from '../store';

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: Object.create(null) as Record<string, Workout>,
  reducers: {
    upsertWorkout: (state, action: PayloadAction<Workout>) => {
      state[action.payload.id] = action.payload;
    },
    deleteWorkout: (state, action: PayloadAction<Workout>) => {
      delete state[action.payload.id];
    },
  },
});

export const {
  upsertWorkout,
  deleteWorkout,
} = workoutsSlice.actions;

const workoutsReducer = workoutsSlice.reducer;
export default workoutsReducer;

// #region selectors
export function selectWorkouts(state: RootState): Workout[] {
  return Object.values(state.workouts);
}
// #endregion
