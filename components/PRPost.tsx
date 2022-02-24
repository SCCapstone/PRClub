import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAppDispatch from '../hooks/useAppDispatch';
import Post from '../models/firestore/Post';
import { removePost } from '../state/postsSlice/thunks';
import useAppSelector from '../hooks/useAppSelector';
import { selectWorkoutById } from '../state/workoutsSlice/selectors';
import { selectPRById } from '../state/prsSlice/selectors';

export default function PRPost({ post, forCurrentUser }: {post: Post, forCurrentUser: boolean}) {
  const dispatch = useAppDispatch();
  const pr = useAppSelector((state) => selectPRById(state, post.prId!));
  const workout = useAppSelector((state) => selectWorkoutById(state, pr?.workoutId ?? ''));

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
            earned PR:
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
      <View style={tw`bg-gray-300 p-3`}>
        {pr
          ? (
            <>
              <Text style={tw`font-bold text-lg text-center`}>{pr.exerciseName}</Text>
              <Text style={tw`text-base text-center`}>
                During workout:
                {' '}
                {workout
                  ? <Text style={tw`font-bold text-lg text-center`}>{workout.name}</Text>
                  : <Text style={tw`italic text-lg text-center`}>deleted workout</Text>}
              </Text>
              <View style={tw`bg-gray-800 p-3`}>
                <Text style={tw`text-xl text-white text-center`}>
                  Increased total volume to
                  {' '}
                  <Text style={tw`text-xl text-white text-center font-bold`}>{pr.volume}</Text>
                  !
                </Text>
              </View>
            </>
          )
          : <Text style={tw`italic text-lg text-center`}>deleted PR</Text>}
      </View>
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
