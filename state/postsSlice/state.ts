import { createEntityAdapter, SerializedError } from '@reduxjs/toolkit';
import Post from '../../types/shared/Post';
import { SliceStatus } from '../../types/state/SliceStatus';

interface ServiceCallResult {
  success: boolean,
  error?: SerializedError
}

interface PostsInitialState {
  status: SliceStatus | 'callingService',
  postsServiceUpsertResult: ServiceCallResult | null,
  postsServiceRemoveResult: ServiceCallResult | null,
}

export const postsAdapter = createEntityAdapter<Post>();

export const initialState = postsAdapter.getInitialState<PostsInitialState>({
  status: 'idle',
  postsServiceUpsertResult: null,
  postsServiceRemoveResult: null,
});
