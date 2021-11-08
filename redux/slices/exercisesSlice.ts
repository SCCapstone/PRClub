/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Exercise from '../../models/Exercise';
import { RootState } from '../store';

interface ExercisesState {
  exercises: Exercise[];
}

const initialState: ExercisesState = {
  exercises: [],
};

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    upsertExercise: (state, action: PayloadAction<Exercise>) => {
      const i = state.exercises.findIndex((e) => e.id === action.payload.id);
      if (i >= 0) {
        state.exercises[i] = action.payload;
      } else {
        state.exercises = [...state.exercises, action.payload];
      }
    },
    deleteExercise: (state, action: PayloadAction<Exercise>) => {
      state.exercises = state.exercises.filter((e) => e.id !== action.payload.id);
    },
  },
});

export const { upsertExercise, deleteExercise } = exercisesSlice.actions;

export const selectExercises = (state: RootState) => state.exercises.exercises;

const exercisesReducer = exercisesSlice.reducer;
export default exercisesReducer;
