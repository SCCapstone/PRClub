import {
  createUserWithEmailAndPassword,
  NextOrObserver,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  User as FirebaseUser,
  UserCredential,
} from '@firebase/auth';
import { doc, setDoc } from '@firebase/firestore';
import { auth, COLLECTIONS, db } from '../firebase';
import User from '../types/shared/User';

async function signUp(email: string, password: string): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  if (!userCredential.user.email) {
    throw new Error('Something went wrong, user must have an email address.');
  }

  // create document for user
  const user: User = {
    id: userCredential.user.uid,
    email: userCredential.user.email,
    workoutIds: [],
  };
  await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);

  return userCredential;
}

async function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

async function logOut(): Promise<void> {
  signOut(auth);
}

async function verifyEmail(user: FirebaseUser): Promise<void> {
  sendEmailVerification(user);
}

function registerAuthStateListener(l: NextOrObserver<FirebaseUser | null>): Unsubscribe {
  return auth.onAuthStateChanged(l);
}

export default {
  signUp,
  signIn,
  logOut,
  verifyEmail,
  registerAuthStateListener,
};
