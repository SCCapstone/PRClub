import {
  arrayRemove, arrayUnion, collection, deleteDoc,
  doc, DocumentData, getDoc, getDocs, query,
  QueryDocumentSnapshot, setDoc, updateDoc, where,
} from '@firebase/firestore';
import { db } from '../firebase';
import Post from '../types/shared/Post';
import User from '../types/shared/User';
import { USERS_COLLECTION, POSTS_COLLECTION } from '../constants/firestore';

export default {
  async fetchPostsForUser(userId: string): Promise<Post[]> {
    // fetch user document
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, userId));
    const user = docSnap.data() as User;

    // if the user has posts, query their posts and return them
    if (user.postIds.length > 0) {
      const q = query(collection(db, POSTS_COLLECTION), where('id', 'in', user.postIds));
      const querySnap = await getDocs(q);

      // extract posts from querySnapshot
      const posts: Post[] = [];
      querySnap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
        const post = d.data() as Post;
        posts.push(post);
      });

      return posts;
    }

    // otherwise, return an empty array
    return [];
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
