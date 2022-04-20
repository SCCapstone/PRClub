import { RootState } from '../store';

// selectors can be called by components to access global state about workouts

export function selectWorkoutsCallingService(state: RootState) {
  return state.workouts.callingService;
}

export function selectRemoveWorkoutResult(state: RootState) {
  return state.workouts.removeWorkoutResult;
}

export function selectUpsertWorkoutResult(state: RootState) {
  return state.workouts.upsertWorkoutResult;
}
