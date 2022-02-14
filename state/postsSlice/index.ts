import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Post from '../../types/shared/Post';
import { initialState, postsAdapter } from './state';
import { postsServiceGet } from './thunks';

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    upsertPostToStore: postsAdapter.upsertOne,
    removePostFromStore(state, action: PayloadAction<Post>) {
      postsAdapter.removeOne(state, action.payload.id);
    },
    flushPostsFromStore: postsAdapter.removeAll,
  },
  extraReducers(builder) {
    builder
      .addCase(postsServiceGet.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(postsServiceGet.fulfilled, (state, action: PayloadAction<Post[]>) => {
        postsAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      });
  },
});

export const {
  upsertPostToStore,
  removePostFromStore,
  flushPostsFromStore,
} = postsSlice.actions;

export default postsSlice.reducer;
