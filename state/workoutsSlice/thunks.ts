import { createAsyncThunk } from '@reduxjs/toolkit';
import Workout from '../../types/shared/Workout';
import WorkoutsService from '../../services/WorkoutsService';

export const getWorkouts = createAsyncThunk(
  'workouts/getWorkouts',
  async (userId: string): Promise<Workout[]> => WorkoutsService.getWorkouts(userId),
);
