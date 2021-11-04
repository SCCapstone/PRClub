import { createSlice } from '@reduxjs/toolkit';
import Workout from '../../models/Workout';

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: {
    workouts: <Workout[]>[],
  },
  reducers: {
    addWorkout: (state, action) => {
      const workout: Workout = action.payload;
      state.workouts = [...state.workouts, workout];
    },
    deleteWorkout: (state, action) => {
      const workout: Workout = action.payload;
      state.workouts = state.workouts.filter((w) => w.id !== workout.id);
    },
  },
});

export const { addWorkout, deleteWorkout } = workoutsSlice.actions;
export default workoutsSlice.reducer;
