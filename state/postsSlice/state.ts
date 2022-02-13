import { createEntityAdapter } from '@reduxjs/toolkit';
import Post from '../../types/shared/Post';
import { SliceStatus } from '../../types/state/SliceStatus';

interface PostsInitialState {
  status: SliceStatus
}

export const postsAdapter = createEntityAdapter<Post>();

export const initialState = postsAdapter.getInitialState<PostsInitialState>({
  status: 'idle',
});
