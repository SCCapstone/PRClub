import { collection, query, where } from '@firebase/firestore';
import React from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import Posts from '../../../../components/Posts';
import { POSTS_COLLECTION } from '../../../../constants/firestore';
import useAppSelector from '../../../../hooks/useAppSelector';
import Post from '../../../../models/firestore/Post';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';

export default function HomeScreen() {
  // Redux-level state
  const currentUser = useAppSelector(selectCurrentUser);

  // ReactFire query
  const firestore = useFirestore();
  const postsCollection = collection(firestore, POSTS_COLLECTION);
  const postsQuery = query(
    postsCollection,
    where('userId', 'in',
      (!currentUser?.followingIds.length ? [''] : currentUser?.followingIds) || ['']),
  );
  const {
    status: postsStatus,
    data: postsData,
  } = useFirestoreCollectionData(postsQuery);
  const posts = postsData as Post[];

  if (!currentUser) {
    return <></>;
  }

  return <Posts posts={posts} postsStatus={postsStatus} forCurrentUser={false} />;
}
