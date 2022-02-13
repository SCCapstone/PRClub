import { createSlice, Dictionary, PayloadAction } from '@reduxjs/toolkit';
import Post from '../../types/shared/Post';
import { initialState, postsAdapter } from './state';
import { getPosts } from './thunks';

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    upsertPost: postsAdapter.upsertOne,
    flushPostsFromStore: postsAdapter.removeAll,
    removePostByEntity(state, action: PayloadAction<Post>) {
      state.ids = state.ids.filter((i) => i !== action.payload.id);

      const entities: Dictionary<Post> = {};
      Object.values(state.entities).forEach((p) => {
        if (p && p.id !== action.payload.id) {
          entities[p.id] = p;
        }
      });
      state.entities = entities;
    },
  },
  extraReducers(builder) {
    builder.addCase(getPosts.pending, (state) => {
      state.status = 'fetching';
    });

    builder.addCase(getPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.ids = action.payload.map((p) => p.id);

      const entities: Dictionary<Post> = {};
      action.payload.forEach((p) => {
        entities[p.id] = p;
      });
      state.entities = entities;

      state.status = 'loaded';
    });
  },
});

export const {
  upsertPost,
  flushPostsFromStore,
  removePostByEntity,
} = postsSlice.actions;

export default postsSlice.reducer;
