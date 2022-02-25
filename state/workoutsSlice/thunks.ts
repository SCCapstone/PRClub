import { createAsyncThunk } from '@reduxjs/toolkit';
import WorkoutsService from '../../services/WorkoutsService';
import Workout from '../../models/firestore/Workout';
import { removePRs, upsertPRs } from '../prsSlice/thunks';
import type { AppDispatch } from '../store';

export const fetchWorkoutsForUser = createAsyncThunk<Workout[], string>(
  'workouts/fetchWorkoutsForUser',
  async (userId: string): Promise<Workout[]> => WorkoutsService.fetchWorkoutsForUser(userId),
);

export const upsertWorkout = createAsyncThunk<Workout, Workout, {dispatch: AppDispatch}>(
  'workouts/upsertWorkout',
  async (workout: Workout, { dispatch }): Promise<Workout> => {
    const prs = await WorkoutsService.upsertWorkout(workout);

    dispatch(upsertPRs(prs));

    // return workout to be upserted into store when thunk is fulfilled
    return workout;
  },
);

export const removeWorkout = createAsyncThunk<Workout, Workout, {dispatch: AppDispatch}>(
  'workouts/removeWorkout',
  async (workout: Workout, { dispatch }): Promise<Workout> => {
    const prsToDelete = await WorkoutsService.removeWorkout(workout);

    dispatch(removePRs(prsToDelete));

    // return workout to be removed from store when thunk is fulfilled
    return workout;
  },
);
