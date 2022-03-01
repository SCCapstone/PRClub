import { createAsyncThunk } from '@reduxjs/toolkit';
import ImagesService from '../../services/ImagesService';

export const uploadImage = createAsyncThunk<
  string,
  { image: string, userId: string, isProfile: boolean, postId?: string }
>(
  'image/uploadImage',
  async ({
    image, userId, isProfile, postId,
  }): Promise<string> => ImagesService.uploadImage(image, userId, isProfile, postId),
);
