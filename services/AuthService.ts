import {
  createUserWithEmailAndPassword,
  NextOrObserver,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  User,
  UserCredential,
} from '@firebase/auth';
import { auth } from '../firebase';

async function signUp(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

async function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

async function logOut(): Promise<void> {
  signOut(auth);
}

async function verifyEmail(user: User): Promise<void> {
  sendEmailVerification(user);
}

function registerAuthStateListener(l: NextOrObserver<User | null>): Unsubscribe {
  return auth.onAuthStateChanged(l);
}

export default {
  signUp,
  signIn,
  logOut,
  verifyEmail,
  registerAuthStateListener,
};
