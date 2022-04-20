import { createAsyncThunk } from '@reduxjs/toolkit';
import Workout from '../../models/firestore/Workout';
import WorkoutsService from '../../services/WorkoutsService';
import { removePRs, upsertPRs } from '../prsSlice/thunks';
import type { AppDispatch } from '../store';

// action dispatched by frontend to upsert workout to database
export const upsertWorkout = createAsyncThunk<void, Workout, {dispatch: AppDispatch}>(
  'workouts/upsertWorkout',
  async (workout: Workout, { dispatch }: {dispatch: AppDispatch}): Promise<void> => {
    const prs = await WorkoutsService.upsertWorkout(workout);
    dispatch(upsertPRs(prs));
  },
);

// action dispatched by frontend to remove workout from database
export const removeWorkout = createAsyncThunk<void, Workout, {dispatch: AppDispatch}>(
  'workouts/removeWorkout',
  async (workout: Workout, { dispatch }: {dispatch: AppDispatch}): Promise<void> => {
    const prsToDelete = await WorkoutsService.removeWorkout(workout);
    dispatch(removePRs(prsToDelete));
  },
);
