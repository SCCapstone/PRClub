import { RootState } from '../store';
/**
 * Selector for the result of adding a new PR
 * @param state
 * @returns result
 */
export function selectUpsertPRResult(state: RootState) {
  return state.prs.upsertPRResult;
}
