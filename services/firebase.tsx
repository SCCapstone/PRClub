import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAAVQd1H3QrQbrSXioon-Rr9OTR1_opb8Y',
  authDomain: 'prclub-f4e2e.firebaseapp.com',
  projectId: 'prclub-f4e2e',
  storageBucket: 'prclub-f4e2e.appspot.com',
  messagingSenderId: '387696645596',
  appId: '1:387696645596:web:ec8e38df26a0ed1a45eb19',
  measurementId: 'G-TEQ56GBJEG',
};

// initialize firebase
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();

// initialize authentication

const auth = firebase.auth();

const realtimeDB = firebase.database();

const firestoreDB = firebase.firestore();

export { auth };

export { realtimeDB, firestoreDB };

export default app;

// // Listen for authentication state to change.
// onAuthStateChanged(auth, (user) => {
//   if (user != null) {
//     console.log('We are authenticated now!');
//   }

// Do other things
// });
