import {
  ref, uploadBytesResumable, UploadTaskSnapshot,
} from '@firebase/storage';
import path from 'path';
import { storage } from '../firebase/index';

export default {
  async uploadImage(
    image: string, userId: string, isProfile: boolean, postId?: string,
  ): Promise<UploadTaskSnapshot> {
    const response = await fetch(image);
    const blob = await response.blob();

    let imgPath: string;
    if (isProfile) {
      imgPath = path.join(userId, 'profile');
    } else if (!isProfile && postId) {
      imgPath = path.join(userId, 'posts', postId);
    } else {
      throw new Error('`postId` must be provided if `isProfile` is false!');
    }

    const storageRef = ref(storage, path.join('images', imgPath));
    return uploadBytesResumable(storageRef, blob);
  },
};
