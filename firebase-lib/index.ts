import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';
import Constants from 'expo-constants';

if (!Constants.manifest) {
  throw new Error('Constants.manifest must be defined!');
}

if (!Constants.manifest.extra) {
  throw new Error('Constants.manifest.extra must be defined!');
}

export const { firebaseConfig } = Constants.manifest.extra;

export const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
