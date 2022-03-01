import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './state';
import { uploadImage } from './thunks';

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearUploadedImage(state) {
      state.uploadedImage = null;
    },
    clearUploadImageResult(state) {
      state.uploadImageResult = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.uploadingImage = true;
      })
      .addCase(uploadImage.fulfilled, (state, action: PayloadAction<string>) => {
        state.uploadedImage = action.payload;
        state.uploadingImage = false;
        state.uploadImageResult = { success: true };
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadedImage = null;
        state.uploadingImage = false;
        state.uploadImageResult = { success: false, error: action.error };
      });
  },
});

export const {
  clearUploadedImage,
  clearUploadImageResult,
} = imagesSlice.actions;

export default imagesSlice.reducer;
