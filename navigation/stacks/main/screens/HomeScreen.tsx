import React from 'react';
import Posts from '../../../../components/Posts';
import useAppSelector from '../../../../hooks/useAppSelector';
import { selectHomeScreenPosts } from '../../../../state/postsSlice/selectors';

export default function HomeScreen() {
  const posts = useAppSelector(selectHomeScreenPosts);

  return <Posts posts={posts} forCurrentUser={false} />;
}
