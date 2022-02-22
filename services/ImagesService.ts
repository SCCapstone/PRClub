import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import path from 'path';
import { storage } from '../firebase/index';
import Image from '../types/shared/Image';

export default {
  async uploadImage(
    image: Image, userId: string, isProfile: boolean, postId: string,
  ): Promise<void> {
    if (!image.result.cancelled) {
      const response = await fetch(image.result.uri);
      const blob = await response.blob();

      let imgPath: string;
      if (isProfile) {
        imgPath = path.join(userId, 'profile');
      } else {
        imgPath = path.join(userId, 'posts', postId);
      }

      const reference = ref(storage, path.join('images', imgPath));
      await uploadBytesResumable(reference, blob);
    }
  },

  async downloadImage(
    userId: string, isProfile: boolean, postId: string,
  ): Promise<string> {
    let imgPath: string;
    if (isProfile) {
      imgPath = path.join(userId, 'profile');
    } else {
      imgPath = path.join(userId, 'posts', postId);
    }
    const storageRef = ref(storage, path.join('images', imgPath));
    return getDownloadURL(storageRef).then((url) => url);
  },
};
