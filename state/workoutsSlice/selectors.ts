import _ from 'lodash';
import Workout from '../../models/Workout';
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
  return selectWorkouts(state).sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));
}
