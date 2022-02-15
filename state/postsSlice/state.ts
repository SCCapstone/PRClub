import { createEntityAdapter } from '@reduxjs/toolkit';
import Post from '../../types/shared/Post';
import { ServiceCallResult } from '../../types/state/ServiceCallResult';
import { SliceStatus } from '../../types/state/SliceStatus';

interface PostsInitialState {
  status: SliceStatus | 'callingService',
  upsertPostResult: ServiceCallResult | null,
  removePostResult: ServiceCallResult | null,
}

export const postsAdapter = createEntityAdapter<Post>();

export const initialState = postsAdapter.getInitialState<PostsInitialState>({
  status: 'idle',
  upsertPostResult: null,
  removePostResult: null,
});
