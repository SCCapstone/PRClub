import {
  arrayRemove,
  arrayUnion,
  collection, doc, DocumentData, DocumentReference, getDoc, getDocs, query, updateDoc, where,
} from '@firebase/firestore';
import { USERS_COLLECTION } from '../constants/firestore';
import { db } from '../firebase';
import User from '../types/shared/User';

async function checkUserExists(userDocRef: DocumentReference<DocumentData>): Promise<void> {
  if (!(await getDoc(userDocRef)).exists()) {
    throw new Error(`User with id ${userDocRef.id} doesn't exist!`);
  }
}

export default {
  async getUsersByIds(userIds: string[]): Promise<User[]> {
    if (userIds.length === 0) {
      return [];
    }

    const q = query(
      collection(db, USERS_COLLECTION),
      where('id', 'in', userIds),
    );

    const querySnap = await getDocs(q);

    const users: User[] = [];
    querySnap.forEach((u) => {
      users.push(u.data() as User);
    });

    return users;
  },

  async getUsersByQuery(queryString: string): Promise<User[]> {
    if (queryString === '') {
      return [];
    }

    // query by substring using string comparisons
    const q1 = query(
      collection(db, USERS_COLLECTION),
      where('username', '>=', queryString),
      // append PUA unicode character to upper range to catch all matching substrings
      where('username', '<=', `${queryString}\uf8ff`),
    );
    const q2 = query(
      collection(db, USERS_COLLECTION),
      where('name', '>=', queryString),
      where('name', '<=', `${queryString}\uf8ff`),
    );

    const usernameQuerySnap = await getDocs(q1);
    const nameQuerySnap = await getDocs(q2);

    const users: User[] = [];
    usernameQuerySnap.forEach((u) => {
      users.push(u.data() as User);
    });
    nameQuerySnap.forEach((u) => {
      if (!users.map((us) => us.id).includes(u.id)) {
        users.push(u.data() as User);
      }
    });

    return users;
  },

  async createFollowerRelationship(userId: string, userToFollowId: string): Promise<void> {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    checkUserExists(userDocRef);

    const userToFollowDocRef = doc(db, USERS_COLLECTION, userToFollowId);
    checkUserExists(userToFollowDocRef);

    await updateDoc(userDocRef, {
      followingIds: arrayUnion(userToFollowId),
    });

    await updateDoc(userToFollowDocRef, {
      followerIds: arrayUnion(userId),
    });
  },

  async removeFollowerRelationship(userId: string, userToFollowId: string): Promise<void> {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    checkUserExists(userDocRef);

    const userToFollowDocRef = doc(db, USERS_COLLECTION, userToFollowId);
    checkUserExists(userToFollowDocRef);

    await updateDoc(userDocRef, {
      followingIds: arrayRemove(userToFollowId),
    });

    await updateDoc(userToFollowDocRef, {
      followerIds: arrayRemove(userId),
    });
  },
};
