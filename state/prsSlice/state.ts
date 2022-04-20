import { ServiceCallResult } from '../../models/state/ServiceCallResult';
/**
 * Define initial state of a PR
 */
interface PRsInitialState {
  upsertPRResult: ServiceCallResult & {numberPRsUpserted?: number} | null
}

export const initialState: PRsInitialState = {
  upsertPRResult: null,
};
