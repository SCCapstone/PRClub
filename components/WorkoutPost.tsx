import React, { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { likePost, removePost, unlikePost } from '../state/postsSlice/thunks';
import { selectWorkoutById } from '../state/workoutsSlice/selectors';
import Post from '../models/firestore/Post';
import BackButton from './BackButton';
import WorkoutItem from './WorkoutItem';
import { selectCurrentUser } from '../state/userSlice/selectors';

export default function WorkoutPost(
  { post, forCurrentUser }: { post: Post, forCurrentUser: boolean },
) {
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    throw new Error('Current user cannot be null!');
  }

  const dispatch = useAppDispatch();

  if (!post.workoutId) {
    return <></>;
  }

  const workout = useAppSelector((state) => selectWorkoutById(state, post.workoutId));

  const isLiked = post.likedByIds.includes(currentUser.id);

  const [viewingDetails, setViewingDetails] = useState<boolean>(false);

  if (workout && viewingDetails) {
    return (
      <View style={tw`flex-1`}>
        <ScrollView style={tw`h-auto w-full`}>
          <View style={tw`bg-gray-100`}>
            <View style={tw`flex flex-row p-3`}>
              <View style={tw`flex flex-1`}>
                <BackButton onPress={() => setViewingDetails(false)} />
              </View>
              <View style={tw`flex flex-3`}>
                <Text style={tw`text-xl text-center font-bold`}>{`Viewing workout "${workout.name}"`}</Text>
              </View>
              <View style={tw`flex flex-1`} />
            </View>
            <WorkoutItem workout={workout} />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={tw`rounded overflow-hidden shadow-lg m-2 p-2`}>
      <View style={tw`flex flex-row`}>
        <View style={tw`flex flex-4`}>
          <Text>{`On ${new Date(post.createdDate).toLocaleString()},`}</Text>
          <Text>
            @
            <Text style={tw`font-bold`}>
              {post.username}
            </Text>
            {' '}
            posted workout:
          </Text>
        </View>
        <View style={tw`flex flex-1`}>
          {
            forCurrentUser
            && (
              <Button onPress={() => dispatch(removePost(post))}>
                <Ionicons name="trash" size={24} style={tw`text-black`} />
              </Button>
            )
          }
        </View>
      </View>
      <View style={tw`bg-gray-300 p-3 flex flex-row`}>
        <View style={tw`flex flex-3`}>
          {workout
            ? <Text style={tw`font-bold text-lg text-center`}>{workout.name}</Text>
            : <Text style={tw`italic text-lg text-center`}>deleted workout</Text>}
        </View>
        {
          workout
            && (
              <View style={tw`flex flex-1`}>
                <Button
                  mode="contained"
                  onPress={() => {
                    setViewingDetails(true);
                  }}
                >
                  <Ionicons name="chevron-forward" size={16} style={tw`text-white`} />
                </Button>
              </View>
            )
        }
      </View>
      <Text style={tw`font-bold`}>{`${post.likes} like${post.likes !== 1 ? 's' : ''}`}</Text>
      <Ionicons
        name={isLiked ? 'heart' : 'heart-outline'}
        size={24}
        style={isLiked ? tw`text-red-500` : tw`text-black`}
        onPress={isLiked
          ? () => dispatch(unlikePost({ post, userId: currentUser.id }))
          : () => dispatch(likePost({ post, userId: currentUser.id }))}
      />
      <Text>
        <Text style={tw`font-bold`}>
          @
          {post.username}
          :
        </Text>
        <Text>
          {' '}
          {post.caption}
        </Text>
      </Text>
    </View>
  );
}
