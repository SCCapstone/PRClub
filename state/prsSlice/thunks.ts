import { createAsyncThunk } from '@reduxjs/toolkit';
import PRsService from '../../services/PRsService';
import PR from '../../types/shared/PR';

export const fetchPRsForUser = createAsyncThunk<PR[], string>(
  'prs/fetchPRsForUser',
  async (userId: string): Promise<PR[]> => PRsService.fetchPRsForUser(userId),
);

export const upsertPR = createAsyncThunk<PR, PR>(
  'prs/upsertPR',
  async (pr: PR): Promise<PR> => {
    await PRsService.upsertPR(pr);
    return pr;
  },
);

export const removePR = createAsyncThunk<PR, PR>(
  'prs/removePR',
  async (pr: PR): Promise<PR> => {
    await PRsService.removePR(pr);
    return pr;
  },
);
