import { createAsyncThunk } from '@reduxjs/toolkit';
import ImagesService from '../../services/ImagesService';

export const uploadImage = createAsyncThunk<void, {
  image: string,
  userId: string,
  isProfile: boolean,
  postId?: string,
}>(
  'image/uploadImage',
  async ({
    image, userId, isProfile, postId,
  }): Promise<void> => {
    await ImagesService.uploadImage(image, userId, isProfile, postId);
  },
);
