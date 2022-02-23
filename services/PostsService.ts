import {
  arrayRemove, arrayUnion, collection, deleteDoc,
  doc, DocumentData, getDoc, getDocs, query,
  QueryDocumentSnapshot, setDoc, updateDoc, where,
} from '@firebase/firestore';
import _ from 'lodash';
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
      const posts: Post[] = [];

      await Promise.all(
        _.chunk(user.postIds, 10).map(
          async (chunk) => {
            const q = query(collection(db, POSTS_COLLECTION), where('id', 'in', chunk));
            const querySnap = await getDocs(q);

            querySnap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
              const post = d.data() as Post;
              posts.push(post);
            });
          },
        ),
      );

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
};
