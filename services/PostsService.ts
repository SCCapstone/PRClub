import {
  arrayRemove, arrayUnion, deleteDoc, doc, getDoc, increment, setDoc, updateDoc,
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

    // remove post's id from user's postIds
    await updateDoc(doc(db, USERS_COLLECTION, post.userId), {
      postIds: arrayRemove(post.id),
    });

    // remove post's id from likedPostIds of users who liked the post
    await Promise.all(
      post.likedByIds.map(
        async (userId) => {
          await updateDoc(doc(db, USERS_COLLECTION, userId), {
            likedPostIds: arrayRemove(post.id),
          });
        },
      ),
    );
  },

  async likePost(post: Post, userId: string): Promise<void> {
    const postDoc = await getDoc(doc(db, POSTS_COLLECTION, post.id));
    const postInDb: Post = postDoc.data() as Post;

    // if user hasn't already liked post, add like to post and increment like counter
    if (!postInDb.likedByIds.includes(userId)) {
      await updateDoc(doc(db, POSTS_COLLECTION, post.id), {
        likedByIds: arrayUnion(userId),
        likes: increment(1),
      });
    }

    // update user with like
    await updateDoc(doc(db, USERS_COLLECTION, userId), {
      likedPostIds: arrayUnion(post.id),
    });
  },

  async unlikePost(post: Post, userId: string): Promise<void> {
    // add like to post and increment post's like counter
    await updateDoc(doc(db, POSTS_COLLECTION, post.id), {
      likedByIds: arrayRemove(userId),
      likes: increment(-1),
    });

    // update user with like
    await updateDoc(doc(db, USERS_COLLECTION, userId), {
      likedPostIds: arrayRemove(post.id),
    });
  },
};
