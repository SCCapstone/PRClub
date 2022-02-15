import { createAsyncThunk } from '@reduxjs/toolkit';
import Workout from '../../types/shared/Workout';
import WorkoutsService from '../../services/WorkoutsService';

export const workoutsServiceGet = createAsyncThunk(
  'workouts/workoutsServiceGet',
  async (userId: string): Promise<Workout[]> => WorkoutsService.getWorkouts(userId),
);

export const workoutsServiceUpsert = createAsyncThunk(
  'workouts/workoutsServiceUpsert',
  async (workout: Workout): Promise<void> => WorkoutsService.upsertWorkout(workout),
);

export const workoutsServiceRemove = createAsyncThunk(
  'workouts/workoutsServiceRemove',
  async (workout: Workout): Promise<void> => WorkoutsService.removeWorkout(workout),
);
