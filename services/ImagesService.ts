import { doc, getDoc, updateDoc } from '@firebase/firestore';
import {
  getDownloadURL,
  ref, uploadBytes,
} from '@firebase/storage';
import { USERS_COLLECTION } from '../constants/firestore';
import { firestore, storage } from '../firebase-lib/index';
import User from '../models/firestore/User';

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

    const uploadTask = await uploadBytes(storageRef, blob);

    if (postId) {
      await updateDoc(doc(firestore, USERS_COLLECTION, userId), {
        profileImageHash: Date.now(),
      });
    }

    return getDownloadURL(uploadTask.ref);
  },

  async getProfileImageUrl(userId: string): Promise<string> {
    const userData = await getDoc(doc(firestore, USERS_COLLECTION, userId));
    const user = userData.data() as User;

    return `https://firebasestorage.googleapis.com/v0/b/prclub-f4e2e.appspot.com/o/images%2F${userId}%2Fprofile?alt=media${
      user.profileImageHash
        ? `&${user.profileImageHash}`
        : ''
    }`;
  },
};
