import { createAsyncThunk } from '@reduxjs/toolkit';
import Workout from '../../types/shared/Workout';
import WorkoutsService from '../../services/WorkoutsService';

export const fetchWorkoutsForUser = createAsyncThunk<Workout[], string>(
  'workouts/fetchWorkoutsForUser',
  async (userId: string): Promise<Workout[]> => WorkoutsService.fetchWorkoutsForUser(userId),
);

export const upsertWorkout = createAsyncThunk<Workout, Workout>(
  'workouts/upsertWorkout',
  async (workout: Workout): Promise<Workout> => {
    await WorkoutsService.upsertWorkout(workout);
    // return workout to be upserted into store when thunk is fulfilled
    return workout;
  },
);

export const removeWorkout = createAsyncThunk<Workout, Workout>(
  'workouts/removeWorkout',
  async (workout: Workout): Promise<Workout> => {
    await WorkoutsService.removeWorkout(workout);
    // return workout to be removed from store when thunk is fulfilled
    return workout;
  },
);
