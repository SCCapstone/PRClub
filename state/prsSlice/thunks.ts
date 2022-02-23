import { createAsyncThunk } from '@reduxjs/toolkit';
import PRsService from '../../services/PRsService';
import PR from '../../types/shared/PR';

export const fetchPRsForUser = createAsyncThunk<PR[], string>(
  'prs/fetchPRsForUser',
  async (userId: string): Promise<PR[]> => PRsService.fetchPRsForUser(userId),
);

export const upsertPRs = createAsyncThunk<PR[], {userId: string, prs: PR[]}>(
  'prs/upsertPRs',
  async ({ userId, prs }: {userId: string, prs: PR[]}): Promise<PR[]> => {
    await PRsService.upsertPRs(userId, prs);
    return prs;
  },
);

export const removePR = createAsyncThunk<PR, PR>(
  'prs/removePR',
  async (pr: PR): Promise<PR> => {
    await PRsService.removePR(pr);
    return pr;
  },
);
