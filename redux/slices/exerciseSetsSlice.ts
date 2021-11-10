/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ExerciseSet from '../../models/ExerciseSet';
import { RootState } from '../store';

interface ExerciseSetsState {
    exerciseSets: ExerciseSet[];
}

const initialState: ExerciseSetsState = {
  exerciseSets: [],
};

const exerciseSetsSlice = createSlice({
  name: 'exerciseSets',
  initialState,
  reducers: {
    upsertExerciseSet: (state, action: PayloadAction<ExerciseSet>) => {
      const i = state.exerciseSets.findIndex((e) => e.id === action.payload.id);
      if (i >= 0) {
        state.exerciseSets[i] = action.payload;
      } else {
        state.exerciseSets = [...state.exerciseSets, action.payload];
      }
    },
    deleteExerciseSet: (state, action: PayloadAction<ExerciseSet>) => {
      state.exerciseSets = state.exerciseSets.filter((e) => e.id !== action.payload.id);
    },
  },
});

export const { upsertExerciseSet, deleteExerciseSet } = exerciseSetsSlice.actions;

export const selectExerciseSets = (state: RootState) => state.exerciseSets.exerciseSets;

export function selectExerciseSetsForExercise(exerciseId: string) {
  return (state: RootState) => state.exerciseSets.exerciseSets.filter((e) => exerciseId === e.id);
}

const exerciseSetsReducer = exerciseSetsSlice.reducer;
export default exerciseSetsReducer;
