import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Text } from 'react-native-paper';
import tw from 'twrnc';
import Post from '../models/firestore/Post';
import CenteredView from './CenteredView';
import PRPost from './PRPost';
import WorkoutPost from './WorkoutPost';

export default function Posts({
  posts,
  postsStatus,
}: {
  posts: Post[], postsStatus: 'loading' | 'error' | 'success' }) {
  if (postsStatus === 'loading') {
    return (
      <CenteredView>
        <ActivityIndicator />
      </CenteredView>
    );
  }

  if (posts.length > 0) {
    return (
      <ScrollView>
        {posts.map((p) => {
          if (p.prId) {
            return <PRPost post={p} key={p.id} />;
          }

          return <WorkoutPost post={p} key={p.id} />;
        })}
        <View style={tw`h-100`} />
      </ScrollView>
    );
  }

  return (
    <CenteredView>
      <Text style={tw`text-center text-xl`}>No posts!</Text>
    </CenteredView>
  );
}
