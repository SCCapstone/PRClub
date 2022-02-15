import {
  createUserWithEmailAndPassword,
  NextOrObserver, signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  User as FirebaseUser,
} from '@firebase/auth';
import {
  collection, doc, getDoc, getDocs, query, setDoc, where,
} from '@firebase/firestore';
import { USERS_COLLECTION } from '../constants/firestore';
import { auth, db } from '../firebase';
import User from '../types/shared/User';

async function signUp(
  name: string,
  username: string,
  email: string,
  password: string,
): Promise<User> {
  // first, check if username exists
  const q = query(
    collection(db, USERS_COLLECTION),
    where('username', '==', username),
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    throw new Error('Username already exists!');
  }

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
  };
  await setDoc(doc(db, USERS_COLLECTION, user.id), user);

  return user;
}

async function signIn(email: string, password: string): Promise<User> {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const documentSnapshot = await getDoc(doc(db, USERS_COLLECTION, userCred.user.uid));
  return documentSnapshot.data() as User;
}

async function logOut(): Promise<void> {
  signOut(auth);
}

function registerAuthStateListener(l: NextOrObserver<FirebaseUser | null>): Unsubscribe {
  return auth.onAuthStateChanged(l);
}

export default {
  signUp,
  signIn,
  logOut,
  registerAuthStateListener,
};
