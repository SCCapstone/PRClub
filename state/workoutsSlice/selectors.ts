import { RootState } from '../store';

export function selectWorkoutsCallingService(state: RootState) {
  return state.workouts.callingService;
}

export function selectRemoveWorkoutResult(state: RootState) {
  return state.workouts.removeWorkoutResult;
}

export function selectUpsertWorkoutResult(state: RootState) {
  return state.workouts.upsertWorkoutResult;
}
