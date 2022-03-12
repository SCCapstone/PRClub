import {
  getDownloadURL,
  ref, uploadBytesResumable,
} from '@firebase/storage';
import { storage } from '../firebase/index';

export default {
  async uploadImage(
    image: string, userId: string, postId?: string,
  ): Promise<string> {
    const response = await fetch(image);
    const blob = await response.blob();

    const storageRef = ref(
      storage,
      postId ? `images/${userId}/posts/${postId}` : `images/${userId}/profile`,
    );
    const uploadTask = await uploadBytesResumable(storageRef, blob);

    return getDownloadURL(uploadTask.ref);
  },
};
