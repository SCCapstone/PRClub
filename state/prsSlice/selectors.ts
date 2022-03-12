import { RootState } from '../store';

export function selectUpsertPRResult(state: RootState) {
  return state.prs.upsertPRResult;
}
