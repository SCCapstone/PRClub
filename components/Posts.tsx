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
  forCurrentUser,
}: {
  posts: Post[], postsStatus: 'loading' | 'error' | 'success', forCurrentUser: boolean }) {
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
            return <PRPost post={p} key={p.id} forCurrentUser={forCurrentUser} />;
          }

          return <WorkoutPost post={p} key={p.id} forCurrentUser={forCurrentUser} />;
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
