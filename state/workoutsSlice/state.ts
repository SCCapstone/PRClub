import { createEntityAdapter, SerializedError } from '@reduxjs/toolkit';
import { SliceStatus } from '../../types/state/SliceStatus';
import Workout from '../../types/shared/Workout';

interface WorkoutsInitialState {
  status: SliceStatus
  workoutsServiceUpsertResult: ServiceCallResult | null
  workoutsServiceRemoveResult: ServiceCallResult | null
}

interface ServiceCallResult {
  success: boolean
  error?: SerializedError
}

export const workoutsAdapter = createEntityAdapter<Workout>();

export const initialState = workoutsAdapter.getInitialState<WorkoutsInitialState>({
  status: 'idle',
  workoutsServiceUpsertResult: null,
  workoutsServiceRemoveResult: null,

});
