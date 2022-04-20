import { createAsyncThunk } from '@reduxjs/toolkit';
import PRsService from '../../services/PRsService';
import PR from '../../models/firestore/PR';
/**
 * This thunk adds a new PR from the component-side
 */
export const upsertPRs = createAsyncThunk<PR[], PR[]>(
  'prs/upsertPRs',
  async (prs: PR[]): Promise<PR[]> => {
    await PRsService.upsertPRs(prs);
    return prs;
  },
);
/**
 * This thunk removes a PR from the component-side
 */
export const removePR = createAsyncThunk<void, PR>(
  'prs/removePR',
  async (pr: PR): Promise<void> => {
    await PRsService.removePR(pr);
  },
);
/**
 * This thunk removes multiple PRs from the component-side
 */
export const removePRs = createAsyncThunk<void, PR[]>(
  'prs/removePRs',
  async (prs: PR[]): Promise<void> => {
    await PRsService.removePRs(prs);
  },
);
