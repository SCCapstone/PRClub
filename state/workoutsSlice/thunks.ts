import { createAsyncThunk } from '@reduxjs/toolkit';
import Workout from '../../types/shared/Workout';
import WorkoutsService from '../../services/WorkoutsService';

export const getWorkoutsFromDb = createAsyncThunk(
  'workouts/getWorkoutsFromDb',
  async (userId: string): Promise<Workout[]> => WorkoutsService.getWorkouts(userId),
);
