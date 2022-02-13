import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Post from '../types/shared/Post';
import PostItem from './PostItem';

export default function Posts({ posts }: { posts: Post[] }) {
  return (
    <ScrollView>
      {posts.map((p) => <PostItem post={p} key={p.id} />)}
    </ScrollView>
  );
}
