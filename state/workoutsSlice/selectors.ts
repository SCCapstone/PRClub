import { SliceStatus } from '../../types/state/SliceStatus';
import Workout from '../../types/shared/Workout';
import { RootState } from '../store';
import { workoutsAdapter } from './state';

export const {
  selectIds: selectWorkoutIds,
  selectEntities: selectWorkoutEntities,
  selectAll: selectWorkouts,
  selectTotal: selectTotalWorkouts,
  selectById: selectWorkoutById,
} = workoutsAdapter.getSelectors((state: RootState) => state.workouts);

export function selectWorkoutsSortedByMostRecent(state: RootState): Workout[] {
  return selectWorkouts(state)
    .sort((a, b) => (new Date(b.createdDate) > new Date(a.createdDate) ? 1 : -1));
}

export function selectWorkoutsStatus(state: RootState): SliceStatus {
  return state.workouts.status;
}
