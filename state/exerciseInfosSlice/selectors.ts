import { RootState } from '../store';
import { exerciseInfosAdapter } from './state';
/**
 * Selector for exercise data
 */
export const {
  selectAll: selectExerciseInfos,
} = exerciseInfosAdapter.getSelectors((state: RootState) => state.exerciseInfos);
/**
 * Selector for the status of the exercises
 * @param state
 * @returns status
 */
export function selectExericseInfosStatus(state: RootState) {
  return state.exerciseInfos.status;
}
/**
 * Selector that returns true if exercises are syncing
 * @param state
 * @returns boolean
 */
export function selectExerciseInfosAreSyncing(state: RootState) {
  return state.exerciseInfos.isSyncing;
}
