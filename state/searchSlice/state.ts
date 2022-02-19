import { createEntityAdapter } from '@reduxjs/toolkit';
import User from '../../types/shared/User';
import { SliceStatus } from '../../types/state/SliceStatus';

interface SearchInitialState {
  status: SliceStatus,
}

export const searchAdapter = createEntityAdapter<User>();

export const initialState = searchAdapter.getInitialState<SearchInitialState>({
  status: 'idle',
});
