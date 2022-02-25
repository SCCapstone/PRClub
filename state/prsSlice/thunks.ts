import { createAsyncThunk } from '@reduxjs/toolkit';
import PRsService from '../../services/PRsService';
import PR from '../../models/firestore/PR';

export const fetchPRsForUser = createAsyncThunk<PR[], string>(
  'prs/fetchPRsForUser',
  async (userId: string): Promise<PR[]> => PRsService.fetchPRsForUser(userId),
);

export const upsertPRs = createAsyncThunk<PR[], PR[]>(
  'prs/upsertPRs',
  async (prs: PR[]): Promise<PR[]> => {
    await PRsService.upsertPRs(prs);
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

export const removePRs = createAsyncThunk<PR[], PR[]>(
  'prs/removePRs',
  async (prs: PR[]): Promise<PR[]> => {
    await PRsService.removePRs(prs);
    return prs;
  },
);
