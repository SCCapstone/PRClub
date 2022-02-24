import { createEntityAdapter, SerializedError } from '@reduxjs/toolkit';
import { SliceStatus } from '../../models/state/SliceStatus';
import Workout from '../../models/firestore/Workout';

interface WorkoutsInitialState {
  status: SliceStatus | 'callingService'
  upsertWorkoutResult: ServiceCallResult | null
  removeWorkoutResult: ServiceCallResult | null
}

interface ServiceCallResult {
  success: boolean
  error?: SerializedError
}

export const workoutsAdapter = createEntityAdapter<Workout>();

export const initialState = workoutsAdapter.getInitialState<WorkoutsInitialState>({
  status: 'idle',
  upsertWorkoutResult: null,
  removeWorkoutResult: null,
});
