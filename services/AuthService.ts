import {
  createUserWithEmailAndPassword,
  NextOrObserver, signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  User as FirebaseUser,
} from '@firebase/auth';
import {
  collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where,
} from '@firebase/firestore';
import { USERS_COLLECTION } from '../constants/firestore';
import { auth, db } from '../firebase';
import User from '../types/shared/User';

async function checkUsernameIsAvailable(username: string): Promise<void> {
  const q = query(
    collection(db, USERS_COLLECTION),
    where('username', '==', username),
  );
  const querySnap = await getDocs(q);
  if (!querySnap.empty) {
    throw new Error('Username already exists!');
  }
}

async function signUp(
  name: string,
  username: string,
  email: string,
  password: string,
): Promise<User> {
  await checkUsernameIsAvailable(username);

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
    followerIds: [],
    followingIds: [],
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

async function updateName(userId: string, newName: string): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, userId);

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      name: newName,
    });
  } else {
    throw new Error('User does not exist!');
  }
}

async function updateUsername(userId: string, newUsername: string): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, userId);

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const user = docSnap.data() as User;
    if (user.username === newUsername) {
      return;
    }

    await checkUsernameIsAvailable(newUsername);

    await updateDoc(docRef, {
      username: newUsername,
    });
  } else {
    throw new Error('User does not exist!');
  }
}

export default {
  signUp,
  signIn,
  logOut,
  registerAuthStateListener,
  updateName,
  updateUsername,
};
