import { createSlice } from '@reduxjs/toolkit';
import Exercise from '../../models/Exercise';

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState: {
    exercises: <Exercise[]>[],
  },
  reducers: {
    addExercise: (state, action) => {
      const exercise: Exercise = action.payload;
      state.exercises = [...state.exercises, exercise];
    },
    deleteExercise: (state, action) => {
      const exercise: Exercise = action.payload;
      state.exercises = state.exercises.filter((e) => e.id !== exercise.id);
    },
  },
});

export const { addExercise, deleteExercise } = exercisesSlice.actions;

const exercisesReducer = exercisesSlice.reducer;
export default exercisesReducer;
