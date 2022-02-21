import { createEntityAdapter } from '@reduxjs/toolkit';
import PR from '../../types/shared/PR';
import { SliceStatus } from '../../types/state/SliceStatus';

interface PRsInitialState {
  status: SliceStatus
}

export const prsAdapter = createEntityAdapter<PR>();

export const initialState = prsAdapter.getInitialState<PRsInitialState>({
  status: 'idle',
});
