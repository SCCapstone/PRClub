import {
  arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc,
} from '@firebase/firestore';
import { POSTS_COLLECTION, USERS_COLLECTION } from '../constants/firestore';
import { db } from '../firebase';
import Post from '../models/firestore/Post';
import User from '../models/firestore/User';
import { queryCollectionById } from '../utils/firestore';

export default {
  async fetchPostsForUser(userId: string): Promise<Post[]> {
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, userId));
    const user = docSnap.data() as User;
    return queryCollectionById(POSTS_COLLECTION, user.postIds);
  },

  async upsertPost(post: Post): Promise<void> {
    // add or update post
    await setDoc(doc(db, POSTS_COLLECTION, post.id), post);

    // add postId to user's postIds if it doesn't already exist
    await updateDoc(doc(db, USERS_COLLECTION, post.userId), {
      postIds: arrayUnion(post.id),
    });
  },

  async removePost(post: Post): Promise<void> {
    // remove post
    await deleteDoc(doc(db, POSTS_COLLECTION, post.id));

    // remove postId from user's postIds
    await updateDoc(doc(db, USERS_COLLECTION, post.userId), {
      postIds: arrayRemove(post.id),
    });
  },

  async likePost(postId: string, userId: string): Promise<void> {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userDocRef);
    const user = userSnap.data() as User;
    const postDocRef = doc(db, POSTS_COLLECTION, postId);

    await updateDoc(postDocRef, {
      likedBy: arrayUnion(user.id),
    });
  },

  async unlikePost(postId: string, userId: string): Promise<void> {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userDocRef);
    const user = userSnap.data() as User;
    const postDocRef = doc(db, POSTS_COLLECTION, postId);

    await updateDoc(postDocRef, {
      likedBy: arrayRemove(user.id),
    });
  },

  async isPostLiked(postId: string, userId: string): Promise<boolean> {
    const postSnap = await getDoc(doc(db, POSTS_COLLECTION, postId));
    const post = postSnap.data() as Post;
    const likedByRef = post.likedBy;
    console.log(likedByRef);
    return likedByRef.includes(userId);
  },
};
