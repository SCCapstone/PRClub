import { createAsyncThunk } from '@reduxjs/toolkit';
import ImagesService from '../../services/ImagesService';

interface UploadImageThunkArgs {
  image: string,
  userId: string,
  isProfile: boolean,
  postId?: string,
}

interface DownloadImageThunkArgs {
  userId: string,
  isProfile: boolean,
  postId?: string,
}

export const uploadImage = createAsyncThunk<void, UploadImageThunkArgs>(
  'image/uploadImage',
  async ({
    image, userId, isProfile, postId,
  }: UploadImageThunkArgs): Promise<void> => {
    await ImagesService.uploadImage(image, userId, isProfile, postId);
  },
);

export const downloadImage = createAsyncThunk<string, DownloadImageThunkArgs>(
  'image/downloadImage',
  async ({
    userId, isProfile, postId,
  }: DownloadImageThunkArgs): Promise<string> => {
    const image = await ImagesService.downloadImage(userId, isProfile, postId);
    // return image to be returned from Firebase when thunk is fulfilled
    return image;
  },
);
