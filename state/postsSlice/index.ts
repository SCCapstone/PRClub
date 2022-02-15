import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Post from '../../types/shared/Post';
import { initialState, postsAdapter } from './state';
import { fetchPostsForUser, removePost, upsertPost } from './thunks';

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPostsServiceUpsertResult(state) {
      state.postsServiceUpsertResult = null;
    },
    clearPostsServiceRemoveResult(state) {
      state.postsServiceRemoveResult = null;
    },
    flushPostsFromStore: postsAdapter.removeAll,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPostsForUser.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(fetchPostsForUser.fulfilled, (state, action: PayloadAction<Post[]>) => {
        postsAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      })
      .addCase(upsertPost.pending, (state) => {
        state.status = 'callingService';
      })
      .addCase(upsertPost.fulfilled, (state, action: PayloadAction<Post>) => {
        postsAdapter.upsertOne(state, action.payload);
        state.postsServiceUpsertResult = { success: true };
        state.status = 'loaded';
      })
      .addCase(upsertPost.rejected, (state, action) => {
        state.postsServiceUpsertResult = { success: false, error: action.error };
        state.status = 'loaded';
      })
      .addCase(removePost.pending, (state) => {
        state.status = 'callingService';
      })
      .addCase(removePost.fulfilled, (state, action: PayloadAction<Post>) => {
        postsAdapter.removeOne(state, action.payload.id);
        state.postsServiceRemoveResult = { success: true };
        state.status = 'loaded';
      })
      .addCase(removePost.rejected, (state, action) => {
        state.postsServiceRemoveResult = { success: false, error: action.error };
        state.status = 'loaded';
      });
  },
});

export const {
  clearPostsServiceUpsertResult,
  clearPostsServiceRemoveResult,
  flushPostsFromStore,
} = postsSlice.actions;

export default postsSlice.reducer;
