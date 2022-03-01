import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { uploadImage } from './thunks';

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearUploadImageResult(state) {
      state.uploadImageResult = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.uploadingImage = true;
      })
      .addCase(uploadImage.fulfilled, (state) => {
        state.uploadImageResult = { success: true };
        state.uploadingImage = false;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadImageResult = { success: false, error: action.error };
        state.uploadingImage = false;
      });
  },
});

export const {
  clearUploadImageResult,
} = imagesSlice.actions;

export default imagesSlice.reducer;
