import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import tw from 'twrnc';
import Post from '../types/shared/Post';
import CenteredView from './CenteredView';
import PRPost from './PRPost';
import WorkoutPost from './WorkoutPost';

export default function Posts(
  { posts, forCurrentUser }: { posts: Post[], forCurrentUser: boolean },
) {
  if (posts.length > 0) {
    return (
      <ScrollView>
        {posts.map((p) => {
          if (p.kind === 'workout') {
            return <WorkoutPost post={p} key={p.id} forCurrentUser={forCurrentUser} />;
          }

          if (p.kind === 'pr') {
            return <PRPost post={p} key={p.id} forCurrentUser={forCurrentUser} />;
          }

          return <View key={p.id} />;
        })}
      </ScrollView>
    );
  }

  return (
    <CenteredView>
      <Text style={tw`text-center text-xl`}>No posts!</Text>
    </CenteredView>
  );
}
