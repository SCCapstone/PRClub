// SAGAS: handle syncing databse with Redux store anytime an action is dispatched via user input
import { PayloadAction } from '@reduxjs/toolkit';
import { call, takeLatest } from 'redux-saga/effects';
import { removeWorkoutByEntity, upsertWorkout } from '.';
import Workout from '../../models/Workout';
import WorkoutsService from '../../services/WorkoutsService';

function* handleUpsertWorkout(action: PayloadAction<Workout>) {
  yield call(WorkoutsService.upsertWorkout, action.payload);
}
export function* upsertWorkoutSaga() {
  yield takeLatest(upsertWorkout.type, handleUpsertWorkout);
}

function* handleRemoveWorkout(action: PayloadAction<Workout>) {
  yield call(WorkoutsService.removeWorkout, action.payload);
}
export function* removeWorkoutSaga() {
  yield takeLatest(removeWorkoutByEntity.type, handleRemoveWorkout);
}
