import { createAsyncThunk } from '@reduxjs/toolkit';
import PRsService from '../../services/PRsService';
import PR from '../../models/firestore/PR';

export const upsertPRs = createAsyncThunk<PR[], PR[]>(
  'prs/upsertPRs',
  async (prs: PR[]): Promise<PR[]> => {
    await PRsService.upsertPRs(prs);
    return prs;
  },
);

export const removePR = createAsyncThunk<void, PR>(
  'prs/removePR',
  async (pr: PR): Promise<void> => {
    await PRsService.removePR(pr);
  },
);

export const removePRs = createAsyncThunk<void, PR[]>(
  'prs/removePRs',
  async (prs: PR[]): Promise<void> => {
    await PRsService.removePRs(prs);
  },
);
