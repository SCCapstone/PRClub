import { createEntityAdapter } from '@reduxjs/toolkit';
import WgerExerciseInfo from '../../models/services/WgerExerciseInfo';
import { SliceStatus } from '../../models/state/SliceStatus';
/**
 * Define initial state of an exercise
 */
interface ExerciseInfosInitialState {
  status: SliceStatus;
  isSyncing: boolean;
}

export const exerciseInfosAdapter = createEntityAdapter<WgerExerciseInfo>();

export const initialState = exerciseInfosAdapter.getInitialState<ExerciseInfosInitialState>({
  status: 'idle',
  isSyncing: false,
});
