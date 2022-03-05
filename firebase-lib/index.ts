import { initializeApp } from '@firebase/app';
import { connectAuthEmulator, getAuth } from '@firebase/auth';
import { connectFirestoreEmulator, getFirestore } from '@firebase/firestore';
import { connectStorageEmulator, getStorage } from '@firebase/storage';
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

if (__DEV__) {
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
}
