import { createEntityAdapter } from '@reduxjs/toolkit';
import PR from '../../types/shared/PR';
import { ServiceCallResult } from '../../types/state/ServiceCallResult';
import { SliceStatus } from '../../types/state/SliceStatus';

interface PRsInitialState {
  status: SliceStatus
  upsertPRResult: ServiceCallResult & {numberPRsUpserted?: number} | null
}

export const prsAdapter = createEntityAdapter<PR>();

export const initialState = prsAdapter.getInitialState<PRsInitialState>({
  status: 'idle',
  upsertPRResult: null,
});
