import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './state';
import {
  addComment, addImageToPost, likePost, removeComment, removePost, unlikePost, upsertPost,
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
    clearUploadedImageToPost(state) {
      state.uploadedImage = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(upsertPost.pending, (state) => {
        state.callingService = true;
      })
      .addCase(upsertPost.fulfilled, (state) => {
        state.upsertPostResult = { success: true };
        state.callingService = false;
      })
      .addCase(upsertPost.rejected, (state, action) => {
        state.upsertPostResult = { success: false, error: action.error };
        state.callingService = false;
      });

    builder
      .addCase(removePost.pending, (state) => {
        state.callingService = true;
      })
      .addCase(removePost.fulfilled, (state) => {
        state.removePostResult = { success: true };
        state.callingService = false;
      })
      .addCase(removePost.rejected, (state, action) => {
        state.removePostResult = { success: false, error: action.error };
        state.callingService = false;
      });

    builder
      .addCase(likePost.pending, (state) => {
        state.interactingWithPost = true;
      })
      .addCase(likePost.rejected, (state) => {
        state.interactingWithPost = false;
      })
      .addCase(likePost.fulfilled, (state) => {
        state.interactingWithPost = true;
      });

    builder
      .addCase(unlikePost.pending, (state) => {
        state.interactingWithPost = true;
      })
      .addCase(unlikePost.rejected, (state) => {
        state.interactingWithPost = false;
      })
      .addCase(unlikePost.fulfilled, (state) => {
        state.interactingWithPost = true;
      });

    builder
      .addCase(addImageToPost.pending, (state) => {
        state.uploadingImage = true;
      })
      .addCase(addImageToPost.fulfilled, (state, action: PayloadAction<string>) => {
        state.uploadedImage = action.payload;
        state.uploadingImage = false;
      });

    builder
      .addCase(addComment.pending, (state) => {
        state.interactingWithPost = true;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.interactingWithPost = false;
      });

    builder
      .addCase(removeComment.pending, (state) => {
        state.interactingWithPost = true;
      })
      .addCase(removeComment.fulfilled, (state) => {
        state.interactingWithPost = false;
      });
  },
});

export const {
  clearUpsertPostResult,
  clearRemovePostResult,
  clearUploadedImageToPost,
} = postsSlice.actions;

export default postsSlice.reducer;
