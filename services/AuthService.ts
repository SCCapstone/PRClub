import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut,
} from '@firebase/auth';
import {
  collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where,
} from '@firebase/firestore';
import { getDownloadURL, ref } from '@firebase/storage';
import { USERS_COLLECTION } from '../constants/firestore';
import { auth, firestore, storage } from '../firebase-lib';
import User from '../models/firestore/User';
import ImagesService from './ImagesService';

// "private" functions
async function checkUsernameIsAvailable(username: string): Promise<void> {
  const q = query(
    collection(firestore, USERS_COLLECTION),
    where('username', '==', username),
  );
  const querySnap = await getDocs(q);
  if (!querySnap.empty) {
    throw new Error('Username already exists!');
  }
}

// "public" functions
export default {
  async signUp(name: string, username: string, email: string, password: string): Promise<User> {
    await checkUsernameIsAvailable(username);

    // if username doesn't exist, proceed with registration
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    if (!userCred.user.email) {
      throw new Error('Something went wrong, user must have an email address.');
    }

    // create document for user
    const user: User = {
      id: userCred.user.uid,
      name,
      username,
      email: userCred.user.email,
      workoutIds: [],
      postIds: [],
      prIds: [],
      followerIds: [],
      followingIds: [],
      likedPostIds: [],
      commentIds: [],
      profileImageHash: Date.now(),
    };
    await setDoc(doc(firestore, USERS_COLLECTION, user.id), user);

    const defaultProfilePicUrl = 'https://firebasestorage.googleapis.com/v0/b/prclub-f4e2e.appspot.com/o/images%2Fdefault-profile-pic.png?alt=media';
    await ImagesService.uploadImage(defaultProfilePicUrl, user.id);

    return user;
  },

  async signIn(email: string, password: string): Promise<User> {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const userDoc = doc(firestore, USERS_COLLECTION, userCred.user.uid);

    const expectedProfileImageRef = ref(storage, `images/${userCred.user.uid}/profile`);

    try {
      await getDownloadURL(expectedProfileImageRef);
    } catch {
      const defaultProfilePicUrl = 'https://firebasestorage.googleapis.com/v0/b/prclub-f4e2e.appspot.com/o/images%2Fdefault-profile-pic.png?alt=media';
      await ImagesService.uploadImage(defaultProfilePicUrl, userCred.user.uid);
    }

    await updateDoc(userDoc, {
      profileImageHash: Date.now(),
    });

    const documentSnapshot = await getDoc(userDoc);

    return documentSnapshot.data() as User;
  },

  async logOut(): Promise<void> {
    signOut(auth);
  },

  async updateName(userId: string, newName: string): Promise<void> {
    const docRef = doc(firestore, USERS_COLLECTION, userId);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        name: newName,
      });
    } else {
      throw new Error('User does not exist!');
    }
  },

  async updateUsername(userId: string, newUsername: string): Promise<void> {
    const docRef = doc(firestore, USERS_COLLECTION, userId);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const user = docSnap.data() as User;
      if (user.username === newUsername) {
        return;
      }

      await checkUsernameIsAvailable(newUsername);

      await updateDoc(docRef, {
        username: newUsername,
      });
    } else {
      throw new Error('User does not exist!');
    }
  },
};
