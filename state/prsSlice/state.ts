import { createEntityAdapter } from '@reduxjs/toolkit';
import PR from '../../models/firestore/PR';
import { ServiceCallResult } from '../../models/state/ServiceCallResult';
import { SliceStatus } from '../../models/state/SliceStatus';

interface PRsInitialState {
  status: SliceStatus
  upsertPRResult: ServiceCallResult & {numberPRsUpserted?: number} | null
}

export const prsAdapter = createEntityAdapter<PR>();

export const initialState = prsAdapter.getInitialState<PRsInitialState>({
  status: 'idle',
  upsertPRResult: null,
});
