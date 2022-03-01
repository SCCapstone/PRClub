import {
  arrayRemove,
  arrayUnion, doc, DocumentData, DocumentReference, getDoc, updateDoc,
} from '@firebase/firestore';
import { USERS_COLLECTION } from '../constants/firestore';
import { firestore } from '../firebase';

async function checkUserExists(userDocRef: DocumentReference<DocumentData>): Promise<void> {
  if (!(await getDoc(userDocRef)).exists()) {
    throw new Error(`User with id ${userDocRef.id} doesn't exist!`);
  }
}

export default {
  async createFollowerRelationship(userId: string, userToFollowId: string): Promise<void> {
    const userDocRef = doc(firestore, USERS_COLLECTION, userId);
    checkUserExists(userDocRef);

    const userToFollowDocRef = doc(firestore, USERS_COLLECTION, userToFollowId);
    checkUserExists(userToFollowDocRef);

    await updateDoc(userDocRef, {
      followingIds: arrayUnion(userToFollowId),
    });

    await updateDoc(userToFollowDocRef, {
      followerIds: arrayUnion(userId),
    });
  },

  async removeFollowerRelationship(userId: string, userToFollowId: string): Promise<void> {
    const userDocRef = doc(firestore, USERS_COLLECTION, userId);
    checkUserExists(userDocRef);

    const userToFollowDocRef = doc(firestore, USERS_COLLECTION, userToFollowId);
    checkUserExists(userToFollowDocRef);

    await updateDoc(userDocRef, {
      followingIds: arrayRemove(userToFollowId),
    });

    await updateDoc(userToFollowDocRef, {
      followerIds: arrayRemove(userId),
    });
  },
};
