import { createEntityAdapter } from '@reduxjs/toolkit';
import Post from '../../models/firestore/Post';
import { ServiceCallResult } from '../../models/state/ServiceCallResult';
import { SliceStatus } from '../../models/state/SliceStatus';

interface PostsInitialState {
  status: SliceStatus | 'callingService' | 'interactingWithPost',
  upsertPostResult: ServiceCallResult | null,
  removePostResult: ServiceCallResult | null,
}

export const postsAdapter = createEntityAdapter<Post>();

export const initialState = postsAdapter.getInitialState<PostsInitialState>({
  status: 'idle',
  upsertPostResult: null,
  removePostResult: null,
});
