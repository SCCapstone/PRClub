import { createSlice } from '@reduxjs/toolkit';
import { initialState, imageAdapter } from './state';
import { downloadImage, uploadImage } from './thunks';

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    flushImagesFromStore: imageAdapter.removeAll,
  },
  extraReducers(builder) {
    builder
      .addCase(uploadImage.fulfilled, (state) => {
        state.status = 'loaded';
      })
      .addCase(uploadImage.pending, (state) => {
        state.status = 'uploadingImage';
      })
      .addCase(uploadImage.rejected, (state) => {
        state.status = 'fetching';
      })
      .addCase(downloadImage.fulfilled, (state) => {
        state.status = 'loaded';
      })
      .addCase(downloadImage.rejected, (state, action) => {
        state.storageError = action.error;
        state.status = 'idle';
      })
      .addCase(downloadImage.pending, (state) => {
        state.status = 'downloadingImage';
      });
  },
});

export const {
  flushImagesFromStore,
} = imagesSlice.actions;

export default imagesSlice.reducer;
