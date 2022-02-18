import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import tw from 'twrnc';
import Post from '../types/shared/Post';
import CenteredView from './CenteredView';
import PostItem from './PostItem';

export default function Posts(
  { posts, forCurrentUser }: { posts: Post[], forCurrentUser: boolean },
) {
  if (posts.length > 0) {
    return (
      <ScrollView>
        {posts.map((p) => <PostItem post={p} key={p.id} forCurrentUser={forCurrentUser} />)}
      </ScrollView>
    );
  }

  return (
    <CenteredView>
      <Text style={tw`text-center text-xl`}>No posts!</Text>
    </CenteredView>
  );
}
