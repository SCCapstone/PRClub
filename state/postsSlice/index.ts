import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Post from '../../models/firestore/Post';
import { initialState, postsAdapter } from './state';
import { fetchPostsForUser, removePost, upsertPost } from './thunks';

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearUpsertPostResult(state) {
      state.upsertPostResult = null;
    },
    clearRemovePostResult(state) {
      state.removePostResult = null;
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
        state.upsertPostResult = { success: true };
        state.status = 'loaded';
      })
      .addCase(upsertPost.rejected, (state, action) => {
        state.upsertPostResult = { success: false, error: action.error };
        state.status = 'loaded';
      })
      .addCase(removePost.pending, (state) => {
        state.status = 'callingService';
      })
      .addCase(removePost.fulfilled, (state, action: PayloadAction<Post>) => {
        postsAdapter.removeOne(state, action.payload.id);
        state.removePostResult = { success: true };
        state.status = 'loaded';
      })
      .addCase(removePost.rejected, (state, action) => {
        state.removePostResult = { success: false, error: action.error };
        state.status = 'loaded';
      });
  },
});

export const {
  clearUpsertPostResult,
  clearRemovePostResult,
  flushPostsFromStore,
} = postsSlice.actions;

export default postsSlice.reducer;
