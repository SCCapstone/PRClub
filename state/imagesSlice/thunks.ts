import { createAsyncThunk } from '@reduxjs/toolkit';
import ImagesService from '../../services/ImagesService';
import ImageType from '../../types/shared/Image';

interface UploadImageThunkArgs {
  image: ImageType,
  userId: string,
  isProfile: boolean,
  postId: string,
}

export const uploadImage = createAsyncThunk(
  'image/uploadImage',
  async ({
    image, userId, isProfile, postId,
  }: UploadImageThunkArgs): Promise<void> => {
    await ImagesService.uploadImage(image, userId, isProfile, postId);
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
