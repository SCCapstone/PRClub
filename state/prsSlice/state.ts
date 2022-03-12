import { ServiceCallResult } from '../../models/state/ServiceCallResult';

interface PRsInitialState {
  upsertPRResult: ServiceCallResult & {numberPRsUpserted?: number} | null
}

export const initialState: PRsInitialState = {
  upsertPRResult: null,
};
