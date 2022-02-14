import React, { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { removePostFromStore } from '../state/postsSlice';
import { postsServiceRemove } from '../state/postsSlice/thunks';
import { selectWorkoutById } from '../state/workoutsSlice/selectors';
import Post from '../types/shared/Post';
import BackButton from './BackButton';
import WorkoutItem from './WorkoutItem';

export default function PostItem({ post }: { post: Post }) {
  const dispatch = useAppDispatch();

  const workout = useAppSelector((state) => selectWorkoutById(state, post.workoutId));
  if (!workout) {
    throw new Error('Workout cannot be undefined!');
  }

  const [viewingDetails, setViewingDetails] = useState<boolean>(false);

  if (viewingDetails) {
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
          <Text>Posted workout:</Text>
        </View>
        <View style={tw`flex flex-1`}>
          <Button
            onPress={() => {
              dispatch(removePostFromStore(post));
              dispatch(postsServiceRemove(post));
            }}
          >
            <Ionicons name="trash" size={24} style={tw`text-black`} />
          </Button>
        </View>
      </View>
      <View style={tw`bg-gray-300 p-3 flex flex-row`}>
        <View style={tw`flex flex-3`}>
          <Text style={tw`font-bold text-lg text-center`}>{workout.name}</Text>
        </View>
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
      </View>
      <Text>
        <Text style={tw`font-bold`}>
          @
          {post.userId}
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
