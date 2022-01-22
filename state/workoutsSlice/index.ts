import { createSlice } from '@reduxjs/toolkit';
import { initialState, workoutsAdapter } from './state';

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    upsertWorkout: workoutsAdapter.upsertOne,
    removeWorkout: workoutsAdapter.removeOne,
  },
});

export const {
  upsertWorkout,
  removeWorkout,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
