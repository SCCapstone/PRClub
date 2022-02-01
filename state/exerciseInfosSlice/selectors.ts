import { RootState } from '../store';
import { exerciseInfosAdapter } from './state';

export const {
  selectAll: selectExerciseInfos,
} = exerciseInfosAdapter.getSelectors((state: RootState) => state.exerciseInfos);

export function selectExericseInfosStatus(state: RootState) {
  return state.exerciseInfos.status;
}
