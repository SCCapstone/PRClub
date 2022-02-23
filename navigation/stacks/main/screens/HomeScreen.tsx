import React from 'react';
import Posts from '../../../../components/Posts';
import useAppSelector from '../../../../hooks/useAppSelector';
import { selectCurrentUserFollowingPosts } from '../../../../state/postsSlice/selectors';

export default function HomeScreen() {
  const posts = useAppSelector(selectCurrentUserFollowingPosts);

  return <Posts posts={posts} forCurrentUser={false} />;
}
