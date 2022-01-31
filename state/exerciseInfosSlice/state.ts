import { createEntityAdapter } from '@reduxjs/toolkit';
import WgerExerciseInfo from '../../types/services/WgerExerciseInfo';
import { SliceStatus } from '../../types/state/SliceStatus';

interface ExerciseInfosInitialState {
  status: SliceStatus;
}

export const exerciseInfosAdapter = createEntityAdapter<WgerExerciseInfo>();

export const initialState = exerciseInfosAdapter.getInitialState<ExerciseInfosInitialState>({
  status: 'idle',
});