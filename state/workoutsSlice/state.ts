// STATE: holds declaration of slice's initial state
import { createEntityAdapter } from '@reduxjs/toolkit';
import { SliceStatus } from '../../models/SliceStatus';
import Workout from '../../models/Workout';

interface WorkoutsInitialState {
  status: SliceStatus
}

export const workoutsAdapter = createEntityAdapter<Workout>();

export const initialState = workoutsAdapter.getInitialState<WorkoutsInitialState>({
  status: 'idle',
});
