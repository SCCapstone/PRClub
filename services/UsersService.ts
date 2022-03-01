import {
  arrayRemove,
  arrayUnion, doc, DocumentData, DocumentReference, getDoc, updateDoc,
} from '@firebase/firestore';
import { USERS_COLLECTION } from '../constants/firestore';
import { db } from '../firebase';

async function checkUserExists(userDocRef: DocumentReference<DocumentData>): Promise<void> {
  if (!(await getDoc(userDocRef)).exists()) {
    throw new Error(`User with id ${userDocRef.id} doesn't exist!`);
  }
}

export default {
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
