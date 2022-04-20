import {
  arrayRemove,
  arrayUnion, doc, DocumentData, DocumentReference, getDoc, updateDoc,
} from '@firebase/firestore';
import { USERS_COLLECTION } from '../constants/firestore';
import { firestore } from '../firebase-lib';
import User from '../models/firestore/User';
/**
 * This function checks if a user exists in the database
 * @param userDocRef a user's document reference
 */
async function checkUserExists(userDocRef: DocumentReference<DocumentData>): Promise<void> {
  if (!(await getDoc(userDocRef)).exists()) {
    throw new Error(`User with id ${userDocRef.id} doesn't exist!`);
  }
}

export default {
  /**
   * This function returns a specified user
   * @param userId the id of the specified user
   * @returns user object
   */
  async fetchUser(userId: string): Promise<User | null> {
    const userDocRef = doc(firestore, USERS_COLLECTION, userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return null;
    }

    return userDocSnap.data() as User;
  },
  /**
   * This function creates a follower relationship between two users
   * @param userId id of the current user
   * @param userToFollowId id of the user they want to follow
   */
  async createFollowerRelationship(userId: string, userToFollowId: string): Promise<void> {
    const userDocRef = doc(firestore, USERS_COLLECTION, userId);
    await checkUserExists(userDocRef);

    const userToFollowDocRef = doc(firestore, USERS_COLLECTION, userToFollowId);
    await checkUserExists(userToFollowDocRef);

    await updateDoc(userDocRef, {
      followingIds: arrayUnion(userToFollowId),
    });

    await updateDoc(userToFollowDocRef, {
      followerIds: arrayUnion(userId),
    });
  },
  /**
   * This function removes a follower relationship
   * @param userId the id of the current user
   * @param userToFollowId the id of the user they were previously following
   */
  async removeFollowerRelationship(userId: string, userToFollowId: string): Promise<void> {
    const userDocRef = doc(firestore, USERS_COLLECTION, userId);
    await checkUserExists(userDocRef);

    const userToFollowDocRef = doc(firestore, USERS_COLLECTION, userToFollowId);
    await checkUserExists(userToFollowDocRef);

    await updateDoc(userDocRef, {
      followingIds: arrayRemove(userToFollowId),
    });

    await updateDoc(userToFollowDocRef, {
      followerIds: arrayRemove(userId),
    });
  },
};
