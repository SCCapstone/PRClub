import { createEntityAdapter } from '@reduxjs/toolkit';
import User from '../../types/shared/User';
import { SliceStatus } from '../../types/state/SliceStatus';

interface UsersInitialState {
  status: SliceStatus,
}

export const usersAdapter = createEntityAdapter<User>();

export const initialState = usersAdapter.getInitialState<UsersInitialState>({
  status: 'idle',
});
