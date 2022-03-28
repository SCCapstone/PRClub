import { collection, query, where } from '@firebase/firestore';
import _ from 'lodash';
import React from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import Posts from '../../../../components/Posts';
import { POSTS_COLLECTION } from '../../../../constants/firestore';
import { useAppSelector } from '../../../../hooks/redux';
import Post from '../../../../models/firestore/Post';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';
import { sortByDate } from '../../../../utils/arrays';

export default function HomeScreen() {
  // Redux-level state
  const currentUser = useAppSelector(selectCurrentUser);

  // ReactFire queries
  const firestore = useFirestore();
  const postsCollection = collection(firestore, POSTS_COLLECTION);

  // get current user's following's posts
  const currentUserFollowingPostsQuery = query(
    postsCollection,
    where('userId', 'in',
      (!currentUser?.followingIds.length ? [''] : currentUser?.followingIds) || ['']),
  );
  const {
    status: currentUserFollowPostsStatus,
    data: currentUserFollowingPostsData,
  } = useFirestoreCollectionData(currentUserFollowingPostsQuery);
  const currentUserFollowingPosts = currentUserFollowingPostsData as Post[];

  // get current user's posts:
  const currentUserPostsQuery = query(
    postsCollection,
    where('userId', '==', currentUser?.id || ''),
  );
  const {
    status: currentUserPostsStatus,
    data: currentUserPostsData,
  } = useFirestoreCollectionData(currentUserPostsQuery);
  const currentUserPosts = currentUserPostsData as Post[];

  // merge both queries
  const posts = _.unionBy(
    currentUserFollowingPosts,
    currentUserPosts,
    (p) => p.id,
  );

  // combine both queries' statuses
  let postsStatus: 'loading' | 'success' | 'error';
  if (currentUserFollowPostsStatus === 'success' && currentUserPostsStatus === 'success') {
    postsStatus = 'success';
  } else if (currentUserFollowPostsStatus === 'loading' || currentUserPostsStatus === 'loading') {
    postsStatus = 'loading';
  } else {
    postsStatus = 'error';
  }

  if (!currentUser) {
    return <></>;
  }

  return (
    <Posts
      posts={sortByDate(posts, (p) => p.createdDate)}
      postsStatus={postsStatus}
      forCurrentUser={false}
      isHomeScreen
    />
  );
}
