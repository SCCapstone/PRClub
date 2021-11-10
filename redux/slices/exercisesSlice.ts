/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import produce from 'immer';
import Exercise from '../../models/Exercise';
import ExerciseSet from '../../models/ExerciseSet';
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
    upsertExerciseSetIntoExercise: (state, action: PayloadAction<ExerciseSet>) => {
      const i = state.exercises.findIndex((e) => e.id === action.payload.exerciseId);
      if (i >= 0) {
        state.exercises[i] = produce(state.exercises[i], (draft) => {
          const j = draft.exerciseSets.findIndex((e) => e.id === action.payload.id);
          if (j >= 0) {
            draft.exerciseSets[j] = action.payload;
          } else {
            draft.exerciseSets = [...draft.exerciseSets, action.payload];
          }
        });
      } else {
        // TODO: figure out edge case here
      }
    },
    deleteExercise: (state, action: PayloadAction<Exercise>) => {
      state.exercises = state.exercises.filter((e) => e.id !== action.payload.id);
    },
    deleteExerciseSetFromExercise: (state, action: PayloadAction<ExerciseSet>) => {
      const i = state.exercises.findIndex((e) => e.id === action.payload.exerciseId);
      if (i >= 0) {
        state.exercises[i] = produce(state.exercises[i], (draft) => {
          draft.exerciseSets = draft.exerciseSets.filter((e) => e.id !== action.payload.id);
        });
      } else {
        // TODO: figure out edge case here
      }
    },
  },
});

export const {
  upsertExercise,
  upsertExerciseSetIntoExercise,
  deleteExercise,
  deleteExerciseSetFromExercise,
} = exercisesSlice.actions;

export const selectExercises = (state: RootState) => state.exercises.exercises;

const exercisesReducer = exercisesSlice.reducer;
export default exercisesReducer;
