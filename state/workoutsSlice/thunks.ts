// THUNKS: handle calls to database that hydrate Redux store on startup
import { createAsyncThunk } from '@reduxjs/toolkit';
import Workout from '../../models/Workout';
import WorkoutsService from '../../services/WorkoutsService';

// eslint-disable-next-line import/prefer-default-export
export const getWorkoutsFromDb = createAsyncThunk(
  'workouts/getWorkoutsFromDb',
  async (userId: string): Promise<Workout[]> => WorkoutsService.getWorkouts(userId)
  ,
);
