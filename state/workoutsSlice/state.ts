import { createEntityAdapter } from '@reduxjs/toolkit';
import { SliceStatus } from '../../types/state/SliceStatus';
import Workout from '../../types/shared/Workout';

interface WorkoutsInitialState {
  status: SliceStatus
}

export const workoutsAdapter = createEntityAdapter<Workout>();

export const initialState = workoutsAdapter.getInitialState<WorkoutsInitialState>({
  status: 'idle',
});
