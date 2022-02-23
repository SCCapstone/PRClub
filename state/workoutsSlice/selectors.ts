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

export function selectWorkoutsSortedByMostRecentByUserId(
  state: RootState, userId: string,
): Workout[] {
  return selectWorkouts(state)
    .filter((w) => w.userId === userId)
    .sort((a, b) => (new Date(b.createdDate) > new Date(a.createdDate) ? 1 : -1));
}

export function selectWorkoutsStatus(state: RootState) {
  return state.workouts.status;
}

export function selectRemoveWorkoutResult(state: RootState) {
  return state.workouts.removeWorkoutResult;
}


export function selectUpsertWorkoutResult(state: RootState) {
  return state.workouts.upsertWorkoutResult;
}