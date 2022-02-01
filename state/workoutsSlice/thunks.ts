import { createAsyncThunk } from '@reduxjs/toolkit';
import Workout from '../../types/shared/Workout';
import WorkoutsService from '../../services/WorkoutsService';

export const fetchWorkoutsFromDb = createAsyncThunk(
  'workouts/fetchWorkoutsFromDb',
  async (userId: string): Promise<Workout[]> => WorkoutsService.getWorkouts(userId),
);
