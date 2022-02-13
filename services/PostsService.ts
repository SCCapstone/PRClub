import {
  arrayRemove, arrayUnion, collection, deleteDoc,
  doc, DocumentData, getDoc, getDocs, query,
  QueryDocumentSnapshot, setDoc, updateDoc, where,
} from '@firebase/firestore';
import { COLLECTIONS, db } from '../firebase';
import Post from '../types/shared/Post';
import User from '../types/shared/User';

async function getPosts(userId: string): Promise<Post[]> {
  // fetch user document
  const documentSnapshot = await getDoc(doc(db, COLLECTIONS.USERS, userId));
  const user = documentSnapshot.data() as User;

  // if the user has posts, query their posts and return them
  if (user.postIds.length > 0) {
    const q = query(collection(db, COLLECTIONS.POSTS), where('id', 'in', user.postIds));
    const querySnapshot = await getDocs(q);

    // extract posts from querySnapshot
    const posts: Post[] = [];
    querySnapshot.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
      const post = d.data() as Post;
      posts.push(post);
    });

    return posts;
  }

  // otherwise, return an empty array
  return [];
}

async function upsertPost(post: Post): Promise<void> {
  // add or update post
  await setDoc(doc(db, COLLECTIONS.POSTS, post.id), post);

  // add postId to user's postIds if it doesn't already exist
  await updateDoc(doc(db, COLLECTIONS.USERS, post.userId), {
    postIds: arrayUnion(post.id),
  });
}

async function removePost(post: Post): Promise<void> {
  // remove post
  await deleteDoc(doc(db, COLLECTIONS.POSTS, post.id));

  // remove postId from user's postIds
  await updateDoc(doc(db, COLLECTIONS.USERS, post.userId), {
    postIds: arrayRemove(post.id),
  });
}

export default {
  getPosts,
  upsertPost,
  removePost,
};
