import {
  arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc,
} from '@firebase/firestore';
import { COMMENTS_COLLECTION, POSTS_COLLECTION, USERS_COLLECTION } from '../constants/firestore';
import { firestore } from '../firebase-lib';
import Comment from '../models/firestore/Comment';
import Post from '../models/firestore/Post';

export default {
  async upsertPost(post: Post): Promise<void> {
    // add or update post
    await setDoc(doc(firestore, POSTS_COLLECTION, post.id), post);

    // add postId to user's postIds if it doesn't already exist
    await updateDoc(doc(firestore, USERS_COLLECTION, post.userId), {
      postIds: arrayUnion(post.id),
    });
  },

  async removePost(post: Post): Promise<void> {
    // remove post
    await deleteDoc(doc(firestore, POSTS_COLLECTION, post.id));

    // remove post's id from user's postIds
    await updateDoc(doc(firestore, USERS_COLLECTION, post.userId), {
      postIds: arrayRemove(post.id),
    });

    // remove post's id from likedPostIds of users who liked the post
    await Promise.all(
      post.likedByIds.map(
        async (userId) => {
          await updateDoc(doc(firestore, USERS_COLLECTION, userId), {
            likedPostIds: arrayRemove(post.id),
          });
        },
      ),
    );

    // remove all comments for post
    await Promise.all(
      post.commentIds.map(
        async (commentId) => {
          await deleteDoc(doc(firestore, COMMENTS_COLLECTION, commentId));
        },
      ),
    );
  },

  async likePost(post: Post, userId: string): Promise<void> {
    const postDoc = await getDoc(doc(firestore, POSTS_COLLECTION, post.id));
    const postInDb: Post = postDoc.data() as Post;

    // if user hasn't already liked post, add like to post and increment like counter
    if (!postInDb.likedByIds.includes(userId)) {
      await updateDoc(doc(firestore, POSTS_COLLECTION, post.id), {
        likedByIds: arrayUnion(userId),
      });
    }

    // update user with like
    await updateDoc(doc(firestore, USERS_COLLECTION, userId), {
      likedPostIds: arrayUnion(post.id),
    });
  },

  async unlikePost(post: Post, userId: string): Promise<void> {
    if (post.likedByIds.length > 0) {
      // add like to post and increment post's like counter
      await updateDoc(doc(firestore, POSTS_COLLECTION, post.id), {
        likedByIds: arrayRemove(userId),
      });

      // update user with like
      await updateDoc(doc(firestore, USERS_COLLECTION, userId), {
        likedPostIds: arrayRemove(post.id),
      });
    }
  },

  async addComment(post: Post, comment: Comment): Promise<void> {
    // add comment to comments collection
    await setDoc(doc(firestore, COMMENTS_COLLECTION, comment.id), comment);
    // add comment id to commentIds
    await updateDoc(doc(firestore, POSTS_COLLECTION, post.id), {
      commentIds: arrayUnion(comment.id),
    });

    await updateDoc(doc(firestore, USERS_COLLECTION, post.userId), {
      commentIds: arrayUnion(comment.id),
    });
  },

  async removeComment(post: Post, comment: Comment): Promise<void> {
    // remove comment from comments collection
    await deleteDoc(doc(firestore, COMMENTS_COLLECTION, comment.id));
    // remove comment id from commentIds
    await updateDoc(doc(firestore, POSTS_COLLECTION, post.id), {
      commentIds: arrayRemove(comment.id),
    });

    await updateDoc(doc(firestore, USERS_COLLECTION, post.userId), {
      commentIds: arrayRemove(comment.id),
    });
  },
};
