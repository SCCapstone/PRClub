import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential,
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

export default {
  signUp,
  signIn,
  logOut,
};
