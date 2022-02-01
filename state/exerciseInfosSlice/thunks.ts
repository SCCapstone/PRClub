import { createAsyncThunk } from '@reduxjs/toolkit';
import WgerService from '../../services/WgerService';
import WgerExerciseInfo from '../../types/services/WgerExerciseInfo';

export const fetchExerciseInfos = createAsyncThunk(
  'exerciseInfos/fetchWorkoutInfos',
  async (): Promise<WgerExerciseInfo[]> => WgerService.getAllExerciseInfos(),
);
