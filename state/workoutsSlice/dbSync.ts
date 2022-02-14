import { removeWorkoutByEntity, upsertWorkout } from '.';
import Workout from '../../types/shared/Workout';
import { store } from '../store';
import { workoutsServiceRemove, workoutsServiceUpsert } from './thunks';

export function handleUpsertWorkout(workout: Workout) {
  store.dispatch(upsertWorkout(workout));
  store.dispatch(workoutsServiceUpsert(workout));
}

export function handleRemoveWorkout(workout: Workout) {
  store.dispatch(removeWorkoutByEntity(workout));
  store.dispatch(workoutsServiceRemove(workout));
}
