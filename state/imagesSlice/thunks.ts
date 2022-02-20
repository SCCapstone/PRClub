import { createAsyncThunk } from '@reduxjs/toolkit';
import ImagesService from '../../services/ImagesService';
import ImageType from '../../types/shared/Image';

export const uploadImage = createAsyncThunk(
  'image/uploadImage',
  async (image: ImageType): Promise<void> => {
    await ImagesService.uploadImage(image);
  },
);

export const downloadImage = createAsyncThunk<ImageType, ImageType>(
  'image/downloadImage',
  async (image: ImageType): Promise<ImageType> => {
    await ImagesService.downloadImage(image);
    // return image to be returned from Firebase when thunk is fulfilled
    return image;
  },
);
