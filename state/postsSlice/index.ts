import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Post from '../../types/shared/Post';
import { initialState, postsAdapter } from './state';
import { postsServiceGet, postsServiceRemove, postsServiceUpsert } from './thunks';

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    upsertPostToStore: postsAdapter.upsertOne,
    removePostFromStore(state, action: PayloadAction<Post>) {
      postsAdapter.removeOne(state, action.payload.id);
    },
    flushPostsFromStore: postsAdapter.removeAll,
    clearPostsServiceUpsertResult(state) {
      state.postsServiceUpsertResult = null;
    },
    clearPostsServiceRemoveResult(state) {
      state.postsServiceRemoveResult = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(postsServiceGet.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(postsServiceGet.fulfilled, (state, action: PayloadAction<Post[]>) => {
        postsAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      })
      .addCase(postsServiceUpsert.pending, (state) => {
        state.status = 'callingService';
      })
      .addCase(postsServiceUpsert.fulfilled, (state) => {
        state.postsServiceUpsertResult = { success: true };
        state.status = 'loaded';
      })
      .addCase(postsServiceUpsert.rejected, (state, action) => {
        state.postsServiceUpsertResult = { success: false, error: action.error };
        state.status = 'loaded';
      })
      .addCase(postsServiceRemove.pending, (state) => {
        state.status = 'callingService';
      })
      .addCase(postsServiceRemove.fulfilled, (state) => {
        state.postsServiceRemoveResult = { success: true };
        state.status = 'loaded';
      })
      .addCase(postsServiceRemove.rejected, (state, action) => {
        state.postsServiceRemoveResult = { success: false, error: action.error };
        state.status = 'loaded';
      });
  },
});

export const {
  upsertPostToStore,
  removePostFromStore,
  flushPostsFromStore,
  clearPostsServiceUpsertResult,
  clearPostsServiceRemoveResult,
} = postsSlice.actions;

export default postsSlice.reducer;
