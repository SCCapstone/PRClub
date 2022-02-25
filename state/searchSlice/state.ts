import { createEntityAdapter } from '@reduxjs/toolkit';
import User from '../../models/firestore/User';
import { SliceStatus } from '../../models/state/SliceStatus';

interface SearchInitialState {
  status: SliceStatus,
}

export const searchAdapter = createEntityAdapter<User>();

export const initialState = searchAdapter.getInitialState<SearchInitialState>({
  status: 'idle',
});
