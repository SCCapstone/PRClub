import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import path from 'path';
import { storage } from '../firebase/index';

export default {
  async uploadImage(
    image: string, userId: string, isProfile: boolean, postId: string,
  ): Promise<void> {
    const response = await fetch(image);
    const blob = await response.blob();

    let imgPath: string;
    if (isProfile) {
      imgPath = path.join(userId, 'profile');
    } else {
      imgPath = path.join(userId, 'posts', postId);
    }

    const reference = ref(storage, path.join('images', imgPath));
    await uploadBytesResumable(reference, blob);
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
    const url = await getDownloadURL(storageRef);
    return url;
  },

  async downloadDefaultProfileImage() :Promise<string> {
    const storageRef = ref(storage, 'images/default-profile-pic');
    const url = await getDownloadURL(storageRef);
    return url;
  },
};
