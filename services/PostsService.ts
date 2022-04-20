import {
  arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc,
} from '@firebase/firestore';
import { COMMENTS_COLLECTION, POSTS_COLLECTION, USERS_COLLECTION } from '../constants/firestore';
import { firestore } from '../firebase-lib';
import Comment from '../models/firestore/Comment';
import Post from '../models/firestore/Post';

export default {
  /**
   * This function adds a post to firestore
   * @param post the post that is added
   */
  async upsertPost(post: Post): Promise<void> {
    // add or update post
    await setDoc(doc(firestore, POSTS_COLLECTION, post.id), post);

    // add postId to user's postIds if it doesn't already exist
    await updateDoc(doc(firestore, USERS_COLLECTION, post.userId), {
      postIds: arrayUnion(post.id),
    });
  },
  /**
   * This function removes a post from firestore
   * @param post the post that is removed
   */
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
  /**
   * This function adds a like to a specified post from the current user
   * @param post the post that is liked
   * @param userId the id of the user that liked the post
   */
  async likePost(post: Post, userId: string): Promise<void> {
    const postDoc = await getDoc(doc(firestore, POSTS_COLLECTION, post.id));
    const postInDb: Post = postDoc.data() as Post;

    // if user hasn't already liked post, add like to post
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
  /**
   * This function removes the current user's like from a post
   * @param post the post that is unliked by the current user
   * @param userId the id of the user that unliked the post
   */
  async unlikePost(post: Post, userId: string): Promise<void> {
    if (post.likedByIds.length > 0) {
      // remove like from post
      await updateDoc(doc(firestore, POSTS_COLLECTION, post.id), {
        likedByIds: arrayRemove(userId),
      });

      // update user with like
      await updateDoc(doc(firestore, USERS_COLLECTION, userId), {
        likedPostIds: arrayRemove(post.id),
      });
    }
  },
  /**
   * This function adds a comment to a post
   * @param post the post that is being commented
   * @param comment the comment that is added to the post
   */
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
  /**
   * This function removes a comment from a specified post
   * @param post the referenced post
   * @param comment the comment removed from the post
   */
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
