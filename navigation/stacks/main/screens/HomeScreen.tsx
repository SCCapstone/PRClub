import React from 'react';
import Posts from '../../../../components/Posts';
import useAppSelector from '../../../../hooks/useAppSelector';
import { selectHomeScreenPosts } from '../../../../state/postsSlice/selectors';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';

export default function HomeScreen() {
  const posts = useAppSelector(selectHomeScreenPosts);
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    throw new Error('Current user cannot be null!');
  }

  return <Posts posts={posts} forCurrentUser={false} />;
}
