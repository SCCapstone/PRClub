import PR from '../../types/shared/PR';
import { SliceStatus } from '../../types/state/SliceStatus';
import { RootState } from '../store';
import { prsAdapter } from './state';

export const {
  selectIds: selectPRIds,
  selectEntities: selectPREntities,
  selectAll: selectPRs,
  selectTotal: selectTotalPRs,
  selectById: selectPRById,
} = prsAdapter.getSelectors((state: RootState) => state.prs);

export function selectPRsSortedByMostRecentByUserId(
  state: RootState, userId: string,
): PR[] {
  return selectPRs(state)
    .filter((p) => p.userId === userId)
    .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));
}

export function selectPRsStatus(state: RootState): SliceStatus {
  return state.prs.status;
}

export function selectUpsertPRResult(state: RootState) {
  return state.prs.upsertPRResult;
}
