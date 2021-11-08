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
    addExerciseSet: (state, action: PayloadAction<ExerciseSet>) => {
      state.exerciseSets = [...state.exerciseSets, action.payload];
    },
    deleteExerciseSet: (state, action: PayloadAction<ExerciseSet>) => {
      state.exerciseSets = state.exerciseSets.filter((e) => e.id !== action.payload.id);
    },
  },
});

export const { addExerciseSet, deleteExerciseSet } = exerciseSetsSlice.actions;

export const selectExerciseSets = (state: RootState) => state.exerciseSets.exerciseSets;

const exerciseSetsReducer = exerciseSetsSlice.reducer;
export default exerciseSetsReducer;
