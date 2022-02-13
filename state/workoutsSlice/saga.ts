import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, takeLatest } from 'redux-saga/effects';
import { removeWorkoutByEntity, upsertWorkout } from '.';
import WorkoutsService from '../../services/WorkoutsService';
import Workout from '../../types/shared/Workout';

function* upsertWorkoutHandler(action: PayloadAction<Workout>) {
  yield call(WorkoutsService.upsertWorkout, action.payload);
}

function* removeWorkoutHandler(action: PayloadAction<Workout>) {
  yield call(WorkoutsService.removeWorkout, action.payload);
}

export default function* workoutsSaga() {
  yield all([
    takeLatest(upsertWorkout.type, upsertWorkoutHandler),
    takeLatest(removeWorkoutByEntity.type, removeWorkoutHandler),
  ]);
}
