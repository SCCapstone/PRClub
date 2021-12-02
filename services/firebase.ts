import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// initialize firebase
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();

// initialize authentication

const auth = firebase.auth();

const realtimeDB = firebase.database();

const firestoreDB = firebase.firestore();

export { auth, realtimeDB, firestoreDB };

export default app;

// Listen for authentication state to change.
auth.onAuthStateChanged((user) => {
  if (user != null) {
    console.log('We are authenticated now!');
  }
});
