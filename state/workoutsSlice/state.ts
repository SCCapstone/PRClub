import { createEntityAdapter } from '@reduxjs/toolkit';
import { AdapterStatus } from '../../models/AdapterStatus';
import Workout from '../../models/Workout';

interface WorkoutsInitialState {
  status: AdapterStatus
}

export const workoutsAdapter = createEntityAdapter<Workout>();

export const initialState = workoutsAdapter.getInitialState<WorkoutsInitialState>({
  status: 'idle',
});
