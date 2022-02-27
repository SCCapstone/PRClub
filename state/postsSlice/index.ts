import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Post from '../../models/firestore/Post';
import Comment from '../../models/firestore/Comment';
import { initialState, postsAdapter } from './state';
import {
  addImageToPost,
  addComment, removeComment,
  fetchPostsForUser, likePost, removePost, unlikePost, upsertPost,
} from './thunks';

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
    clearUploadedPostImageUri(state) {
      state.uploadedImageUri = null;
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
      })
      .addCase(likePost.pending, (state, action) => {
        const { post, userId } = action.meta.arg;
        if (!post.likedByIds.includes(userId)) {
          postsAdapter.upsertOne(state, {
            ...post,
            likedByIds: [...post.likedByIds, userId],
          });
        }

        state.status = 'interactingWithPost';
      })
      .addCase(likePost.rejected, (state, action) => {
        const { post, userId } = action.meta.arg;
        postsAdapter.upsertOne(state, {
          ...post,
          likedByIds: post.likedByIds.filter((i) => i !== userId),
        });

        state.status = 'loaded';
      })
      .addCase(
        likePost.fulfilled,
        (state, action: PayloadAction<{post: Post, userId: string}>) => {
          const { post, userId } = action.payload;
          if (!post.likedByIds.includes(userId)) {
            postsAdapter.upsertOne(state, {
              ...post,
              likedByIds: [...post.likedByIds, userId],
            });
          }

          state.status = 'loaded';
        },
      )
      .addCase(unlikePost.pending, (state, action) => {
        const { post, userId } = action.meta.arg;
        postsAdapter.upsertOne(state, {
          ...post,
          likedByIds: post.likedByIds.filter((i) => i !== userId),
        });

        state.status = 'interactingWithPost';
      })
      .addCase(unlikePost.rejected, (state, action) => {
        const { post, userId } = action.meta.arg;
        if (!post.likedByIds.includes(userId)) {
          postsAdapter.upsertOne(state, {
            ...post,
            likedByIds: [...post.likedByIds, userId],
          });
        }

        state.status = 'loaded';
      })
      .addCase(
        unlikePost.fulfilled,
        (state, action: PayloadAction<{post: Post, userId: string}>) => {
          const { post, userId } = action.payload;
          postsAdapter.upsertOne(state, {
            ...post,
            likedByIds: post.likedByIds.filter((i) => i !== userId),
          });

          state.status = 'loaded';
        },
      )
      .addCase(addImageToPost.pending, (state) => {
        state.status = 'uploadingImage';
      })
      .addCase(addImageToPost.fulfilled, (state, action: PayloadAction<string>) => {
        state.uploadedImageUri = action.payload;
        state.status = 'loaded';
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<{post: Post, comment: Comment}>) => {
          const { post, comment } = action.payload;
          if (!post.commentIds.includes(comment.id)) {
            postsAdapter.upsertOne(state, {
              ...post,
              commentIds: [...post.commentIds, comment.id],
            });
          }
          state.upsertPostResult = { success: true };
          state.status = 'loaded';
        },
      )
      .addCase(addComment.pending,
        (state) => {
          state.status = 'interactingWithPost';
        })
      .addCase(
        removeComment.fulfilled,
        (state, action: PayloadAction<{post: Post, comment: Comment}>) => {
          const { post, comment } = action.payload;
          postsAdapter.upsertOne(state, {
            ...post,
            commentIds: post.commentIds.filter((i) => i !== comment.id),
          });
          state.status = 'loaded';
        },
      )
      .addCase(removeComment.pending,
        (state) => {
          state.status = 'interactingWithPost';
        });
  },
});

export const {
  clearUpsertPostResult,
  clearRemovePostResult,
  clearUploadedPostImageUri,
  flushPostsFromStore,
} = postsSlice.actions;

export default postsSlice.reducer;
