import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';

export const firebaseConfig = {
  apiKey: 'AIzaSyAAVQd1H3QrQbrSXioon-Rr9OTR1_opb8Y',
  authDomain: 'prclub-f4e2e.firebaseapp.com',
  projectId: 'prclub-f4e2e',
  storageBucket: 'prclub-f4e2e.appspot.com',
  messagingSenderId: '387696645596',
  appId: '1:387696645596:web:ec8e38df26a0ed1a45eb19',
  measurementId: 'G-TEQ56GBJEG',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
