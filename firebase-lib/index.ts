import { FirebaseOptions, initializeApp } from '@firebase/app';
import { connectAuthEmulator, getAuth } from '@firebase/auth';
import { connectFirestoreEmulator, getFirestore } from '@firebase/firestore';
import { connectStorageEmulator, getStorage } from '@firebase/storage';
import Constants from 'expo-constants';

export const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyAAVQd1H3QrQbrSXioon-Rr9OTR1_opb8Y',
  authDomain: 'prclub-f4e2e.firebaseapp.com',
  projectId: 'prclub-f4e2e',
  storageBucket: 'prclub-f4e2e.appspot.com',
  messagingSenderId: '387696645596',
  appId: '1:387696645596:web:ec8e38df26a0ed1a45eb19',
  measurementId: 'G-TEQ56GBJEG',
};

export const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

if (
  Constants.manifest
    && Constants.manifest.extra
    && Constants.manifest.extra.useEmulators
) {
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
}
