import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ImageType from '../../types/shared/Image';
import { initialState, imageAdapter, ImageStatus } from './state';
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
      .addCase(uploadImage.rejected, (state) => {
        state.status = 'fetching';
      })
      .addCase(downloadImage.fulfilled, (state) => {
        state.status = 'loaded';
      })
      .addCase(downloadImage.rejected, (state) => {
        state.status = 'fetching';
      });
  },
});

export const {
  flushImagesFromStore,
} = imagesSlice.actions;

export default imagesSlice.reducer;
